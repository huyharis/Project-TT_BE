var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://hungnv1097:hungoggy1310@cluster0-qh6uw.mongodb.net/TheCakeTea?retryWrites=true&w=majority',{ useNewUrlParser: true}, function(err){
    if(err) throw err;
    else console.log("Ket noi thanh cong !!");
})

require('../app/models/blog');
require('../app/models/order');
require('../app/models/product');
require('../app/models/product_type');
require('../app/models/user');