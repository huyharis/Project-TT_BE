const mongosee = require('mongoose');
const Schema = mongosee.Schema;
const ObjectId = Schema.Types.ObjectId;

const orderSchema = new Schema({
    name: String,
    address: String,
    note: String,
    number_phone: String,
    email: String,
    products: [{ 
        name: String,
        price: Number,
        _id: String,
        amount: Number,
        size: [{
            amount: Number,
            value: String
        }]
    }],
    order_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: false
    },
    total: Number
})

var Order = mongosee.model('Order', orderSchema);
module.exports = Order;