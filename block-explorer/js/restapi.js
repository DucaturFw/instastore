"use strict";
exports.__esModule = true;
var express = require("express");
var agent = require("superagent");
var blockchain_1 = require("./blockchain");
var config_1 = require("./config");
exports.app = express();
exports.app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});
var ADDR = "1DMCGx8KScwVeeDbLiAR8WdJfA6gChKkY7";
// ADDR = `3MQTRzttkMtsMEy9dRq4Sf1xiSsWKgQkyH` // navalny
ADDR = "1E7Ej41tpkWCCHPGtaRiVGndCVtz5Ym8XE"; // op_return test
ADDR = "mqs15Gf9bC2Wq3Gx8TEAD9t7z7zVhXnum7";
ADDR = config_1.wallet_address;
function _err(res, err) {
    res.json({ error: err });
}
exports.app.get("/txs", function (req, res) {
    var addr = ADDR;
    getTransactions(addr, function (err, txs) {
        if (err)
            return _err(res, err);
        res.json({ txs: txs });
    });
});
exports.app.get("/orders", function (req, res) {
    var addr = ADDR;
    getOrders(function (err, orders) {
        if (err)
            return _err(res, err);
        getTransactions(addr, function (err, txs) {
            if (err)
                return _err(res, err);
            var fos = mergeOrdersTransactions(orders, txs);
            res.json({ orders: fos });
        });
    });
});
function getTransactions(addr, callback) {
    var url = "https://testnet.blockchain.info/rawaddr/";
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
function getOrders(callback) {
    /* let FAKE_ORDERS: IOrder[] = [
        {data: {timestamp: 1523117058, amount: 5}, hash: "6f6d6e69000000000000001f000000029b927000"}
    ]
    return setTimeout(() => callback(undefined, FAKE_ORDERS), 50) */
    var url = "http://34.207.88.113:3000/get_orders";
    agent.get("" + url, function (err, res) {
        if (err)
            return callback(err, undefined);
        return callback(undefined, res.body);
    });
}
function mergeOrdersTransactions(orders, txs) {
    txs = txs.filter(function (tx) { return tx.op_return; }); // discard txs without op_return data (can't be matched to any order)
    // console.log(txs.map(tx => tx.op_return.data))
    return orders.map(function (o) { return ({
        order: o,
        tx: txs.filter(function (tx) { return tx.op_return.data == o.hash; })[0]
    }); });
}
