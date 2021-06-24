const router = require('express').Router();
const express = require('express');
const db = require('../db');

router.get("", async (req, res) => {

	const cart = (await db.query(`
		SELECT prod.id, name, count, price FROM cart AS cart
		LEFT JOIN products AS prod ON prod.id = product_id
		WHERE cart.id = '${req.session.user}'`
		)).rows;``

	res.render("cart", {cart: cart});
});

router.get("/checkout", async (req, res) => {
	res.render("checkout"); 
});


router.post("/checkout", express.urlencoded({extended: true}), async (req, res) => {
	
	
	
	// const items = (
	// 	await db.query(`SELECT * FROM cart WHERE id = '${req.session.user}'`)).rows;

	// if (items.length == 0) {
	// 	res.render('index');
	// 	return;
	// }
	let trans;
	try {
		trans = await db.query(`
		DO $$
		DECLARE
			r RECORD;
			BEGIN
				FOR r IN 
				SELECT product_id
				FROM cart
				WHERE id = '${req.session.user}'
				LOOP
					INSERT INTO cart VALUES('testik', 1, 1);
					IF (
						SELECT quantity
						FROM products
						WHERE id = r.product_id
					   ) <= 0 THEN
						RAISE EXCEPTION 'Product is not in stock (%)', r.product_id;
					END IF;
				END LOOP;
			END;
		$$ LANGUAGE plpgsql;
		`);
	}
	
	catch (er) {
		console.log(er);
	}

	res.send('hey');
	return;

	// Check if product is indeed in stock
	let outOfStock = false;


	for (let i = 0; i < items.length; i++) {
		const quantity = (await db.query(`
			SELECT quantity FROM products WHERE id = ${items[i].product_id}
			`)).rows[0].quantity;
		if (quantity == 0) {
			outOfStock = true;
			break;
		}
	}
	
	if (outOfStock) {
		res.render("cart");
		return;
	}



	// Create order
	const email = req.body.email;
	const ordersQuery = email == "" ?
		`INSERT INTO orders(user_id, status) VALUES (${req.session.user_id}, 'AWAIT') RETURNING id` :
		`INSERT INTO orders(email, status) VALUES ('${email}','AWAIT') RETURNING id`;

	const order_id = 
				(await db.query(`
					WITH rows AS (
					${ordersQuery}
					)
					INSERT INTO order_info
					SELECT id,
					'${req.body.first_name}',
					'${req.body.last_name}',
					'${req.body.address}',
					'${req.body.city}',
					'${req.body.postal}',
					'${req.body.country}'
					FROM rows
					RETURNING order_id
					`)).rows[0].order_id;

	
		
	items.forEach(async function(product) {

		await db.query(`
					INSERT INTO order_items(order_id, product_id, quantity) VALUES(
					${order_id}, ${product.product_id}, ${product.count}
					)`)

	// Deacrese quantity of the product that are in stock

		await db.query(`
					UPDATE products SET quantity = quantity - ${product.count} WHERE id = ${product.product_id}
			`);
	});

	// Remove cart

	await db.query(`DELETE FROM cart WHERE id = '${req.session.user}'`)

	res.send("SUCCESS");
})



module.exports = router;