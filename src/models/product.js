const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const product = new Schema({
    title: String,
    description: String,
    category: String,
    path: String,
    price: Number,
    created_at: {type: Date, default: Date.now()}
});

product.plugin(mongoosePaginate);

module.exports = model('Product', product);