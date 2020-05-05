const {Schema, model} = require('mongoose');

const product = new Schema({
    title: String,
    description: String,
    category: String,
    path: String,
    price: Number,
    created_at: {type: Date, default: Date.now()}
});

module.exports = model('Product', product);