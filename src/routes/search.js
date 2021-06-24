const db = require('../db');
const path = require('path')
const router = require('express').Router();

router.get('/', async (req, res) => {
    const product = req.query.q.trim().replace(/[^\w\s]/g, '');
    let { rows } = await db.query(`SELECT similarity(p.name, '${product}') AS sim, * 
		FROM products p 
		WHERE similarity(p.name, '${product}') > 0.2
		ORDER BY sim DESC LIMIT 10`);
    if (rows.length === 0) res.send('Nothing');
    else if (rows.length === 1) res.redirect('/product/' + rows[0].id);
    else res.render('search', { data: rows, original: product });
})

module.exports = router;