const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../../config/constants');
const User = require('../models/user');

module.exports = function(passport) {
    router.get('/', function(req, res){
        res.render('index');
    })

    // FACEBOOK
    router.get('/auth/facebook', passport.authenticate('facebook', {scope : ['public_profile', 'email']}));
    // xử lý sau khi user cho phép xác thực với facebook
    router.get('/auth/facebook/callback', (req, res, next) => {
        passport.authenticate('facebook', (err, user, info) => {
            console.log(user, info);
        })
    });

    // GOOGLE
    
    router.get('/auth/google', passport.authenticate('google', {scope : ['profile', 'email']}));
    // xử lý sau khi user cho phép xác thực với google
    router.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/api'
        }),(req,res)=>{
            if(req.user){
                res.redirect('http://localhost:3000/user/login?token=' + req.user.google.token)
            }
        }
    );
    
    // LOCAL
    router.post('/auth',
        passport.authenticate('local-login', {
            failureRedirect: '/login',
        }), function(req, res) {
            const user = {
                _id: req.user._id,
                username: req.user.local.username,
                isAdmin: req.user.local.isAdmin
            }
            const token = jwt.sign(user, config.myprivatekey, {
                expiresIn: config.tokenLife,
            });
            user['token'] = token;

            res.json(user);
        }
    );
    router.get('/failSignup', (req, res) => {
        console.log('fail')
        res.json('fail');
    })
    router.post('/auth/signup',
        passport.authenticate('local-signup', {
            failureRedirect: '/signup'
        }), function(req, res) {
            const user = {
                _id: req.user._id,
                username: req.user.local.username,
                isAdmin: req.user.local.isAdmin
            }
            res.json(user);
        }
    );
    router.get('/getUser/:token', (req, res) => {
        console.log(req.params)
        User.findOne({ 'google.token': req.params.token }, function (err, user) {
            if(err) res.json('err')
            console.log(user)
            res.json({ data: user})
        })
    })
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }
    return router;
}
