const express = require('express');
const loaders = require('./loaders');
require('dotenv').config({
	path: '.env'
});

void async function () {
	try {
		const app = express();
		await loaders(app);

		app.listen(process.env.PORT, 'localhost', () => 
			console.log('Server is sucessfully started at port: ' + process.env.PORT));
	}
	catch(err) {
		if (err.code == 'ECONNREFUSED' && err.port == process.env.PGPORT) console.log("PostgreSQL database is unreachable.")
		else console.log(err);
	}
}();