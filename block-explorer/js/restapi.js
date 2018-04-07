"use strict";
exports.__esModule = true;
var express = require("express");
var agent = require("superagent");
var blockchain_1 = require("./blockchain");
exports.app = express();
exports.app.get("/txs", function (req, res) {
    var addr = "3MQTRzttkMtsMEy9dRq4Sf1xiSsWKgQkyH"; // navalny
    // addr = `1E7Ej41tpkWCCHPGtaRiVGndCVtz5Ym8XE` // op_return test
    getTransactions(addr, function (err, txs) {
        res.json({ txs: txs });
    });
});
function getTransactions(addr, callback) {
    var url = "https://blockchain.info/rawaddr/";
    agent.get("" + url + addr, function (err, res) {
        if (err)
            return callback(err, undefined);
        var obj = res.body;
        if (!obj || !obj.txs)
            return callback("invalid blockchain.info response", undefined);
        var txs = obj.txs.map(function (tx) { return ({
            tx: tx.out.filter(function (o) { return o.addr == addr; }),
            info: Object.assign({}, tx, { inputs: undefined, out: undefined }),
            op_return: blockchain_1.splitOpReturn((tx.out.filter(blockchain_1.isOpReturn)[0] || { script: "" }).script)
        }); });
        return callback(undefined, txs);
    });
}
