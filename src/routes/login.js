const router = require('express').Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {
	res.render('login', {login:true});
});

router.get('/register', (req, res) => {
	res.render('login', {login:false});
})

router.post('/login', require('express').urlencoded({extended: true}), async (req,res) => {
	let DBres;
	if (req.body.email && req.body.password && await async function() {
		DBres = (await db.query(`
		SELECT * FROM users WHERE email = '${req.body.email}'`)).rows;
		if (!DBres[0]) return false;
		return bcrypt.compare(req.body.password, DBres[0].password);
	}()) {
		req.session.name = DBres[0].first_name;
		req.session.user_id = DBres[0].id;
		res.status(200).send('/');
	}
	else res.status(401).send('Wrong credentials!');
})

router.post('/register', require('express').urlencoded({extended: true}), async (req, res) => {
	bcrypt.hash(req.body.password, 10, async (err, hash) => {
		if (err) res.status(401).send('Wrong credentials!')
		else {
			await db.query(`INSERT INTO users (first_name, last_name, email, password) VALUES 
			('${req.body.first_name}', '${req.body.last_name}', '${req.body.email}', '${hash}')`);
			res.status(200).send('/');
		}
	})
})

router.get('/overview', (req,res) => {
	res.render('overview');
})

module.exports = router;