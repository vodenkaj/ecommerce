const express = require('express');
const path = require('path');
const helmet = require('helmet')
const routes = require(path.join(__dirname, '/../routes/'));
const session = require('express-session');
const cookieParser = require('cookie-parser')
const {nanoid} = require('nanoid');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const morgan = require('morgan');
const rateLimit = require("express-rate-limit");


function createRedisClient(callback) {
	const client = redis.createClient(process.env.REDPORT, process.env.REDHOST);

	client.on('error', err => {
		console.log("REDIS ERROR: \n", err);
		process.exit();
	})

	client.on('connect', () => callback(client));
}

function setupExpress(app, client) {
	app.set('trust proxy', 1);
	app.use(cookieParser());
	app.use(session({
		secret: 'none',
		name: 'sessionid',
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			sameSite: true,
			expires: new Date(253402300000000)
		}, 
		store: new redisStore({host:process.env.REDHOST, port: process.env.REDPORT, client: client, ttl: 86400, resave: false})
	}))
	app.use(helmet());
	app.set('view engine', 'ejs');
	app.set('views', path.join(__dirname, '/../views'));
	app.use(express.static(path.join(__dirname, '/../public')));


	app.use((req, res, next) => {
		res.setHeader("Content-Security-Policy", "script-src 'self' https://kit.fontawesome.com/e8d4cbf103.js");
		res.setHeader('Content-Security-Policy', "script-src' 'self' https://code.jquery.com/jquery-3.5.1.min.js");
		next();
	})

	app.use('/', (req, res, next) => {
		if (req.session.name) res.locals.name = req.session.name;
		if (req.method == 'GET') req.session.lastUrl = req.originalUrl;
		if (!req.session.user) req.session.user = require('shortid').generate();

		req.session.save();
		next()
	})

	app.use('/', routes);
}

module.exports = (app) => {
	createRedisClient((client) => setupExpress(app, client));
}