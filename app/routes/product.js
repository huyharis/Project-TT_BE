const express = require('express'),
    app = express(),
    Product = require('../models/product'),
    ProductType = require('../models/product_type'),
    multer = require('multer');
const { verifyToken } = require('../middleware/auth');    

// MULTER
const storage = multer.diskStorage ({
    destination: (req, file, cb) => {
      cb(null, 'assets/images')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
});
const upload = multer({storage: storage});

// GET
app.get('/', (req, res)=>{
    Product.find({})
            .populate({path: 'product_type_id'})
            .exec(function(err,doc){
                if(err) res.json(err)
                res.json(doc);
            })
})

app.get('/get/:id', (req, res) =>{
    Product.findById({_id: req.params.id })
            .exec(function(err, doc){
                if(err) throw err;
                res.json(doc);
            })
})

app.get('/getType', (req, res)=>{
    ProductType.find({})
            .populate({ path : 'products',})
            .exec(function(err, type){
                if(err) throw err;
                res.json(type);
            })
})

app.get('/getByType/:id', (req, res) => {
    ProductType.findOne({ _id: req.params.id })
            .populate({
                path: 'products', 
                populate: { path: 'product_type_id' }
            })
            .exec(function(err , type) {
                if(err) throw err;
                res.json(type.products);
            });
})

// POST
app.post('/search', (req, res) => {
    Product.find({ name: new RegExp(req.body.name, 'i') })
            .populate({ path: 'product_type_id'})
            .exec(function(err, data){
                if(err) res.json(err);
                
                res.status(200).json(data);
            })
})
app.post('/', verifyToken, upload.single('image'), async (req, res) => {
    console.log(verifyToken)
    var image = '';
    if(req.file){
        image = "/images/" + req.file.originalname;
    }
    const product = new Product({  
        name: req.body.name,
        describe: req.body.describe,
        product_type_id: req.body.type,
        price: req.body.price,
        image
    })
    // product.save(function(err, doc) {
    //     console.log("🚀 ~ file: product.js ~ line 85 ~ response ~ response", doc)
    //     if(err) return res.status(200).json({ message: 'Lỗi. Trùng tên sản phẩm !!'});
    //     // return res.status(200).json({ message: 'Thêm thành công !!'});
    // })

    try {
        const prod = await product.save();
        
        const type = await ProductType.findById(req.body.type)
        type.products.push(prod._id);
        type.save()

        return res.status(200).json({ message: 'Thêm thành công !!'});
       
    } catch (e) {
        return res.status(200).json({ message: 'Lỗi. Trùng tên sản phẩm !!'});
    }
})
// PUT
app.put('/', verifyToken, upload.single('image'), (req, res) => {
    var data = {  
        name: req.body.name,
        describe: req.body.describe,
        product_type_id : req.body.type,
        price: req.body.price,
    }
    if(req.file) {
        data = {  
            name: req.body.name,
            describe: req.body.describe,
            product_type_id : req.body.type,
            price: req.body.price,
            image: "/images/" + req.file.originalname
        }
    }

    Product.findByIdAndUpdate(req.body._id, data, {new: true}, (err) => {
        if(err) res.status(400).json({ message: 'Error !!'});
        res.status(200).json({ message: 'Edit success !!'});
    })
})
// PATCH

// DELETE
app.delete('/:id', verifyToken, (req, res) => {
    Product.deleteOne({ _id : req.params.id }, function(err) {
        if(err) throw err;
        res.json('Delete success !!?');
    })
})

module.exports = app;