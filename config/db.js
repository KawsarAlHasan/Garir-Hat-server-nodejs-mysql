const mysql = require("mysql2/promise");
require("dotenv").config();

const mySqlPool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

module.exports = mySqlPool;
