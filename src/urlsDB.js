const con = require("./mysqlConnect");

function getUrl(code) {
    // check if there is in database entry with this code, if there is and if it's not expired we will return link
    con.query("SELECT * FROM urls WHERE code=?", [code], (err, rows) => {
        if(err) {
            throw err;
        } else if(rows.length > 0) {
            return rows[0].url;
        }
    });
    return "";
}

function getCode() {
    // this need to save url in database
    return new Promise(resolve => {
        let code = "";
        con.query("SHOW TABLE STATUS FROM url_shortener WHERE name like 'urls';", (err, rows) => {
            if(err) {
                throw err;
            } else if(rows.length > 0) {
                const id = rows[0].Auto_increment;
                con.query("SELECT code FROM codes WHERE id=?", [id], (innerErr, innerRows) => {
                    if(innerErr) {
                        throw innerErr;
                    } else if(innerRows.length > 0) {
                        code = innerRows[0].code;
                        resolve(code);
                    }
                });
            }
        });
    });
}

module.exports = {
    getUrl,
    getCode
};
