const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const json = require('./data/product.json');

const productSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    describe: String,
    product_type_id: { 
        type: ObjectId, 
        ref: 'product_type'
    },
    price: Number,
    image: String
});

const Product = mongoose.model('product', productSchema);

// Product.insertMany(json, function(err){
//     if(err) console.log(err);
// })

module.exports = Product;