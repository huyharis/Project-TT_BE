const express = require('express');
const app = express();
const User = require('../models/user');
const { verifyToken } = require('../middleware/auth');

app.get('/', verifyToken, function(req, res) {
    User.find({}, function(err, user){
        res.json(user);
    })
})

app.get('/verify', verifyToken , (req, res) => {
    res.json('access')
})
module.exports = app;