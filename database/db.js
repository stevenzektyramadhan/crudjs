const mysql = require("mysql");

const koneksi = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crudjs",
});

module.exports = koneksi;
