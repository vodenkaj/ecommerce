const router = require('express').Router();
const home = require('./home.js'),
	  search = require('./search.js'),
	  product = require('./product.js'),
	  collection = require('./collection.js'),
	  login = require('./login.js'),
	  api = require('./api'),
	  overview = require('./profile.js'),
	  cart = require('./cart.js');

router.get('', home);
router.use('/cart', cart);
router.use('/account', login);
router.use('/search', search);
router.use('/product', product);
router.use('/collection', collection);

router.use('/api', api);

module.exports = router;