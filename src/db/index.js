const { Pool } = require('pg');

const pool = new Pool();

module.exports = {
	query: (text) => pool.query(text)
}