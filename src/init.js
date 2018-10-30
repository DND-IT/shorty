const con = require("./mysqlConnect");

con.connect(() => {
    try {
        // con.query("CREATE DATABASE url_shortener");
        con.query("USE url_shortener;");
        con.query("CREATE TABLE codes (   id bigint(20) NOT NULL AUTO_INCREMENT,   code varchar(10) COLLATE utf8_unicode_ci NOT NULL,   PRIMARY KEY (id) ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;");
        con.query("CREATE TABLE urls (   id bigint(20) NOT NULL AUTO_INCREMENT,   url varchar(1024) COLLATE utf8_unicode_ci NOT NULL,   dateFrom datetime DEFAULT NULL,   dateTo datetime DEFAULT NULL,   code varchar(25) COLLATE utf8_unicode_ci NOT NULL,   customUrl tinyint(4) NOT NULL DEFAULT '0',   PRIMARY KEY (id) ) ENGINE=InnoDB AUTO_INCREMENT=118000 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;");
    } catch (e) {
        if(e.message.indexOf("database exists") > 0) {
            console.log("Database already exists!");
        } else {
            console.log(e.message);
        }
    }
});
