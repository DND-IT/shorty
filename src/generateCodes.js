const numberPacker = require("./pack");
const con = require("./mysqlConnect");

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while(0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function generate(from, to) {
    if(from > to) {
        [from, to] = [to, from];
    }

    const sql = "SELECT * FROM codes WHERE id BETWEEN ? AND ?";
    con.query(sql, [from, to], (err, rows) => {
        if(err) {
            throw err;
        } else {
            if(rows.length > 0) {
                throw new Error("You already have data in that range!");
            } else {
                let codes = [];
                for(let num = from; num < to; num++) {
                    codes.push(numberPacker.pack(num));
                }
                codes = shuffle(codes);

                let i = 0;
                const values = [];
                for(let num = from; num < to; num++) {
                    values.push([num, codes[i++]]);
                }

                con.query("INSERT INTO codes (id,code) VALUES ?", [values], errInner => {
                    if(errInner) throw errInner;
                    console.log("Records inserted");
                });
            }
        }
    });
}

module.exports = generate;
