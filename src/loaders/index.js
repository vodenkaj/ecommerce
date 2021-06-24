const expressLoader = require('./express');
const postgresLoader = require('./postgres');


module.exports = async (app) => {
	await expressLoader(app);
	await postgresLoader();
}