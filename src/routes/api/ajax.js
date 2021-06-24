const router = require('express').Router();
const path = require('path');
const db = require(path.join(__dirname, '/../../db'));
const express = require('express');
const rateLimit = require("express-rate-limit");
const bcrypt = require('bcrypt');

const atrributes = ['color', 'gender', 'case_shape', 'case_size', 'case_material', 'wrist_material', 'water_resistant']


// RATE LIMITERS

const cartLimiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 15,
	message: "You have to wait before adding another item to your cart!"
})

router.post('/keywords', express.json(), async (req,res) => {
	const name = req.body.word.trim().replace(/[^\w\s]/g, '');
	let {rows} = await db.query(`SELECT similarity(p.name, '${name}') AS sim, * 
		FROM products p
		WHERE similarity(p.name, '${name}') > 0.2
		ORDER BY sim DESC LIMIT 10`);
	res.json(rows);
});

router.get('/sort-products', async (req, res) => {
	const sortByValue = req.query.value;
	const name = req.query.brand.trim().replace(/[^\w\s]/g, '');
	const orderBy = req.query.mode.trim().replace(/[^\w\s]/g, '');
	let filter = '';

	if (sortByValue != null) Object.keys(sortByValue).forEach(key => {
							 key = key.trim().replace(/[^\w\s.]/g, '');
							 let prefix = '';
							 const value = sortByValue[key].map(v => {
							 	v.trim().replace(/[^\w\s]/g, '');
							 	if (sortByValue[key].length == 1) prefix = 'AND';
							 	else prefix = 'OR';
							 	filter += `${prefix} data ->> '${key}' = '${v}'\n`;
							 });
	});

    const { rows } = await db.query(`
	SELECT id, name, supplier_id, price, created_at, data
		FROM products
		LEFT JOIN product_spec ps ON ps.product_id = id
		WHERE supplier_id = ${name}
		${filter}
		ORDER BY ${orderBy};`);
	const sortAttributes = new Object();
	rows.forEach(product => {
	    atrributes.forEach(attr => {
	        if (product[attr]){
	            if (!sortAttributes[attr]) sortAttributes[attr] = new Set();
	            sortAttributes[attr].add(product[attr]);
	        }
	    })
	})

	res.send({ products: rows, attributes: sortAttributes });
});

router.post('/post-review', express.urlencoded({extended:true}), async (req, res) => {
	if (!req.session.user_id) {
		if (req.session.lastUrl) res.redirect(req.session.lastUrl);
		else res.render('index');
	}
	else {
		await db.query(`INSERT INTO products_ratings (product_id, rating, user_id, comment) VALUES (${req.body.product_id},${req.body.rating},${req.session.user_id},'${req.body.feedback}')`)
		res.redirect(req.session.lastUrl);
	}
});

router.get('/cart-products', async (req, res) => {
	const keys = new Map(JSON.parse(req.query.id)).keys();
	const products = [];
	for (const id of keys) {
		products.push((await db.query(`SELECT name, price FROM products WHERE id = ${id}`)).rows);
	}
	res.send({products: products});
});

router.post('/check_email', express.urlencoded({extended:true}), async (req, res) => {
	const DBres = (await db.query(`SELECT email FROM users WHERE email = '${req.body.value}'`)).rows;
	if (DBres.length == 0) res.send('Email is not being used');
	else res.status(400).send('Email is invalid or already taken');
})

router.get('/product/:id/reviews', express.urlencoded({extended:true}), async (req, res) => {
	let param = "";
	if (req.body.sort) param = " AND rating = " + req.body.sort; 
	//const reviews = (await db.query(`SELECT * FROM products_ratings WHERE product_id = ${req.params.id}` + param)).rows;

	const reviews = (await db.query(`
	SELECT (SELECT SUM(rating) FROM products_ratings) as t_rating, c.product_id, c.user_id, c.rating, c.comment, NOW() - c.created_at AS created_at, u.id, u.first_name, u.last_name
	FROM products_ratings c
	LEFT JOIN users u ON c.user_id = u.id
	WHERE product_id = ${req.params.id}`+ param)).rows;

	res.send({data:reviews});
})

router.post("/add-to-cart", cartLimiter, express.urlencoded({extended: true}), async (req, res) => {

	if (!req.cookies.sessionid) return;

	// Ask user for a password if session id + user id doesnt match up

	const result = (await db.query(`
		DO $$
			BEGIN
				IF NOT EXISTS (SELECT 1 FROM cart WHERE id = '${req.session.user}' AND product_id = ${req.body.id}) THEN
					INSERT INTO cart(id, product_id, count) VALUES('${req.session.user}', ${req.body.id}, 1);
				ELSE
					UPDATE cart SET count = count + 1 WHERE id = '${req.session.user}' AND product_id = ${req.body.id};
				END IF;
			END;
		$$ LANGUAGE plpgsql;
		`))

	res.redirect("/cart");
});


router.post("/cart-action", express.urlencoded({extended: true}), async (req, res) => {
	let order_id;

	if (req.body.update) {

		for (let id in req.body) {
			
			if (id == "update" || id == "checkout" || isNaN(req.body[id]))
				continue;

			if (+req.body[id] <= "0" || req.body.checkout) {
				
				await db.query(`

					DELETE FROM cart WHERE
					product_id = ${id}
					AND id = '${req.session.user}'
					`)
			}
			else {
				await db.query(`
					
					UPDATE cart SET count = CASE WHEN
					(SELECT quantity FROM products
					WHERE id = ${id}) >= ${req.body[id]}
					THEN ${req.body[id]}
					ELSE count
					END
					WHERE product_id = ${id}
					AND id = '${req.session.user}'
				`)
			}
			if (order_id) {
				
			}
		}

	}
	else if (req.body.remove) {
		await db.query(`
					DELETE FROM cart WHERE
					product_id = ${req.body.remove}
					AND id = '${req.session.user}'
					`)
	}
	res.redirect("/cart");
});

module.exports = router;
