const router = require('express').Router();
const ajax = require('./ajax.js');

router.use('/', ajax);

module.exports = router;