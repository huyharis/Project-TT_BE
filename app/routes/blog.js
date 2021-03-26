const express = require('express'),
    app = express(),
    multer = require('multer'),
    Blog = require('../models/blog');
const { verifyToken } = require('../middleware/auth');

// MULTER
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/images/blog')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });
// GET
app.get('/', (req, res) => {
    Blog.find({})
        .then(blog => {
            res.json(blog)
        })
        .catch(err => { throw err })
})

// POST
app.post('/add', verifyToken, upload.single('image'), (req, res) => {
    var imageURL = '';
    if(req.file){
        imageURL = "/images/blog/" + req.file.originalname;
    }
    const blog = new Blog({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        imageURL
    });
    blog.save((err) => {
        if(err) res.status(400).json({ message: 'Error !!'});
        res.status(200).json({ message: 'Add success !!'});
    })
})
// PUT
app.put('/update', verifyToken, upload.single('image'), (req, res) => {

    var data = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    }
    if (req.file) {
        data = {
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
            imageURL: '/images/blog/' + req.file.originalname
        }
    }
    Blog.findByIdAndUpdate({ _id: req.body.id }, data, { new: true, useFindAndModify: false }, (err) => {
        if(err) res.status(400).json({ message: 'Error !!'});
        res.status(200).json({ message: 'Edit success !!'});
    })
})
// Delete
app.delete('/:id', verifyToken, (req, res) => {
    Blog.deleteOne({ _id: req.params.id }, (err) => {
        if (err) res.json({ success: 'Delete Error !!' });
        else res.json({ success: 'Delete Success !!' });
    })
})
module.exports = app;