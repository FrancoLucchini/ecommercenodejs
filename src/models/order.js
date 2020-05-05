const {Schema, model} = require('mongoose');

const order = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    numberAddress: {type: String, required: true},
    name: {type: String, required: true},
    paymentId: {type: String, required:true}
});

module.exports = model('Order', order);