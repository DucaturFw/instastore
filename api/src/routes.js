let read_yaml = require('read-yaml');

let hash_order = require('./hash_order');
let validate_order = require('./validate').validate_order;
let save_order = require('./db').save_order

const config = read_yaml.sync('./config.yaml');
config.price = parseFloat(config.price);

console.log('Config', config);

function create_order(req, res) {
    // Validating request info
    if (!validate_order(req.body)) {
        res.status(400).send({'error': 'Request data is not valid.'});
    }

    let order = {
        order_info: {
            amount: parseInt(req.body.order_info.amount),
            total: config.price * parseInt(req.body.order_info.amount)
        },
        user_info: {
            email: req.body.user_info.email
        },
        timestamp: Date.now(),
    }

    order.hash = hash_order(order);

    console.log('Saving the order:', order)

    // Save order to database
    save_order(order)
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

module.exports = function routes(app) {
    app.post('/create_order', create_order);
}