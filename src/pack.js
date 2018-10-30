/**
 * Addapted example from: https://github.com/delight-im/ShortURL
 * Features:
 * + proof against offensive words (removed 'a', 'e', 'i', 'o' and 'u')
 * + unambiguous (removed 'I', 'l', '1', 'O' and '0')
 * + 49^6 -  possible number 13.841.287.201 lowercase 28^6 481890304
 *
 * Example output:
 * 123456789 <=> pgK8p
 */
const numberPacker = {

    // alphabet: "wYWXc5KnjBdMsqgrCv762mxkRNZh9y4bVPfDtGTzHQp8LS3FJ", // "23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ",
    // alphabet: "d73f5mn8x9kvywgqhrztj6p24scb",
    alphabet: "23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ", // BCDFGHJKLMNPQRSTVWXYZ
    base: 49,
    pack(num) {
        let str = "";
        while(num > 0) {
            str = this.alphabet.charAt(num % this.base) + str;
            num = Math.floor(num / this.base);
        }
        return str;
    },

    unpack(str) {
        let num = 0;
        for(let i = 0; i < str.length; i++) {
            num = num * this.base + this.alphabet.indexOf(str.charAt(i));
        }
        return num;
    }
};

module.exports = numberPacker;
