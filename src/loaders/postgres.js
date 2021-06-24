const { Client } = require('pg');


module.exports = async () => {
	const client = new Client({
	host: process.env.PGHOST,
	port: process.env.PGPORT,
	user: process.env.PGUSER,
	password: process.env.PGPASSWORD});
	await client.connect();
}