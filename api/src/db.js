let MongoClient = require('mongodb').MongoClient;

const DB_URL = 'mongodb://34.207.88.113:27017';
const DB_NAME = 'instastore';

function save_order(order) {
    return MongoClient.connect(DB_URL)
        .then(c =>
            c.db(DB_NAME).collection('orders')
                .insertOne(order)
                .then(() => c.close())
        )
}

module.exports['save_order'] = save_order;
