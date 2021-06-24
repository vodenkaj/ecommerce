const router = require('express').Router();
const db = require('../db');

const atrributes = ['color', 'gender', 'case_shape', 'case_size', 'case_material', 'wrist_material', 'water_resistant']

router.get('/:id', async (req, res) => {
    const name = req.params.id.trim().replace(/[^\w\s]/g, '');
    
    const {rows} = await db.query(`
        SELECT id, name, supplier_id, price, created_at, data
        FROM products
        LEFT JOIN product_spec ps ON ps.product_id = id
        WHERE supplier_id = ${name};`);
    const sortAttributes = new Object();
    rows.forEach(product => {
        atrributes.forEach(attr => {
            if (product.data[attr]){
                if (!sortAttributes[attr]) sortAttributes[attr] = new Set();
                sortAttributes[attr].add(product.data[attr]);
            }
        })
    })
    if (rows.length == 0) res.status(404).render('error', {error: 404});
    else res.render('collection', { products: rows, attributes: sortAttributes });
});

module.exports = router;