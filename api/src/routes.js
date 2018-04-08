let read_yaml = require('read-yaml');

let hash_order = require('./hash_order');
let validate_order = require('./validate').validate_order;
let db = require('./db');

const config = read_yaml.sync('./config.yaml');

console.log('Config', config);

function create_order(req, res) {
    // Validating request info
    if (!validate_order(req.body)) {
        res.status(400).send({'error': 'Request data is not valid.'});
    }

    let price = parseFloat(config.prices[req.body.order_info.id.toString()]);

    let order = {
        order_info: {
            amount: parseInt(req.body.order_info.amount),
            total: price * parseInt(req.body.order_info.amount)
        },
        user_info: {
            email: req.body.user_info.email
        },
        timestamp: Date.now(),
    }

    order.hash = hash_order(order);

    console.log('Saving the order:', order)

    // Save order to database
    db.save_order(order)
        .then(() => {
            // Sending response
            res.status(201).send({
                wallet_address: config.wallet_address,
                order_hash: order.hash,
                total: order.order_info.total
            });
        })
        .catch((err) => {
            console.log('Error', err);
            res.status(500).send({'error': 'Smth bad has happened.'});
        })
}

function get_orders(req, res) {
    db.get_orders()
        .then((orders) => res.status(200).send(orders))
        .catch((err) => {
            console.log('Error', err);
            res.status(500).send({'error': 'Smth bad has happened.'});
        })
}

module.exports = function routes(app) {
    app.post('/create_order', create_order);
    app.get('/get_orders', get_orders);
}