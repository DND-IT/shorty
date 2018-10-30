const express = require("express");
const router = express.Router();
const urlsDB = require("../src/urlsDB");
const con = require("../src/mysqlConnect");
const ua = require("universal-analytics");

/* GET home page. */
router.get("/", (req, res) => {
    res.render("index", {title: "Home"});
});
router.get("/initSDatabases", (req, res) => {
    res.render("index", {title: "Home"});
});
router.get("/:code([a-zA-Z0-9]{4,10})", (req, res) => {
    const code = req.params.code;
    con.query("SELECT * FROM urls WHERE code=? LIMIT 1", [code], (err, rows) => {
        if(err) {
            throw err;
        } else {
            const now = new Date();
            const row = rows[0];
            if(!row) {
                // todo - do we need stats for not found pages?
                res.render("error", {message: "Page not found!", error: {status: 404, stack: ""}});
            } else if(row.dateFrom && new Date(row.dateFrom).getTime() > now) {
                console.log("Not started");
                res.send("Not started");
            } else if(row.dateTo && new Date(row.dateTo).getTime() < now) {
                console.log("Expired");
                res.send("Expired");
            } else {

                const visitor = ua("UA-123045320-1", {http: true});
                const tmp = row.url.split("/");
                const host = tmp[0] + "//" + tmp[2];
                const path = row.url.split(host)[1];
                const ip = req.ip;
                const referer = req.headers.referrer || req.headers.referer;
                const params = {
                    dl: row.url,
                    dh: tmp[2],
                    dp: path,
                    dr: referer,
                    uip: ip,
                    ua: req.headers["user-agent"]

                    // todo - check if we need to add ,qt: 50, sc: "end" */
                };
                visitor.pageview(params).send();
                res.send("a");
                //res.redirect(row.url);
            }
        }
    });
});
router.post("/", (req, res) => {
    const params = req.body;
    const url = params.url;
    let promise;
    if(params.customInput) {
        promise = new Promise(resolve => {
            con.query("SELECT code FROM urls WHERE code=?", [params.customInput], (err, rows) => {
                if(err) {
                    throw err;
                }
                resolve(rows.length);
            });
        });
    } else {
        promise = urlsDB.getCode(url);
    }
    promise.then(code => {
        let customUrl = 0;
        if(params.customInput) {
            if(code === 0) {
                code = params.customInput;
                customUrl = 1;
            } else {
                res.send(JSON.stringify({err: "Code already exist"}));
                res.end();
                return;
            }
        }

        const obj = {code: code, url: url};
        let dateFrom = null;
        let dateTo = null;
        if(params.dateStart) {
            dateFrom = params.dateStart + " " + params.timeStart;
        }
        if(params.dateEnd) {
            dateTo = params.dateEnd + " " + params.timeEnd;
        }

        con.query("INSERT urls SET url=?,dateFrom=?,dateTo=?,code=?,customUrl=?", [url, dateFrom, dateTo, code, customUrl], err => {
            if(err) {
                throw err;
            }
        });
        res.send(JSON.stringify(obj));
        res.end();
    });
});

module.exports = router;
