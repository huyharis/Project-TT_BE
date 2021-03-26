const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const json = require('./data/type_product.json');

const ProductTypeSchema = new Schema({
    type_product: String,
    products: [{ 
        type: ObjectId, 
        ref: 'product'
    }]
});

const ProductType = mongoose.model('product_type', ProductTypeSchema);

// ProductType.insertMany(json, function(err){
//     if(err) console.log(err);
// })

module.exports = ProductType;