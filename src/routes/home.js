const router = require('express').Router();
const db = require('../db');

router.get('', async (req, res) => {
    const { rows } = db.query(`
		SELECT product_id, COUNT(product_id)
		FROM order_items
		GROUP BY product_id`);
    res.render('index');
})

module.exports = router;