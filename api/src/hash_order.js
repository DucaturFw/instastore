let crypto = require('crypto');

module.exports = function hash_order(order) {
    let order_string = JSON.stringify(order);

    return crypto.createHmac('sha256', order_string).digest('hex');
}
