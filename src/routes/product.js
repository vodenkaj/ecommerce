const router = require('express').Router();
const db = require('../db');

router.get('/:id', async (req, res) => {
    const name = req.params.id.trim().replace(/[^\w\s]/g, '');
    console.log(name);
	const {rows} = await db.query(`
		DO $$
			DECLARE
				ref refcursor;
			BEGIN

			SELECT p.id, p.quantity, name, price, pr.rating, pr.comment, ps.data
			FROM products AS p
			LEFT JOIN products_ratings pr ON p.id = pr.product_id
			LEFT JOIN product_spec ps ON ps.product_id = p.id
			INTO ref
			WHERE p.id = ${name};

			
			END;
		$$ LANGUAGE plpgsql;

		SELECT ref();
	`);
    // const reviews = (await db.query(`
    // 	SELECT (SELECT SUM(rating) FROM products_ratings WHERE product_id = ${rows[0].id}) as t_rating, c.product_id, c.user_id, c.rating, c.comment, NOW() - c.created_at AS created_at, u.id, u.first_name, u.last_name
    // 	FROM products_ratings c
    // 	LEFT JOIN users u ON c.user_id = u.id
    // 	WHERE product_id = ${rows[0].id}`)).rows;
    console.log(rows);
    res.render('product', { product: rows[0], reviews: reviews})
});
module.exports = router;