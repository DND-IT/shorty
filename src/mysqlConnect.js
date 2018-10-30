const mysql = require("mysql");
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "bambus",
    database: "url_shortener"
});
con.connect(err => {
    if(err) throw err;
    console.log("Connected!");
});

module.exports = con;

