const express = require('express');
const passport = require('passport');
const session  = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

require('./config/passport')(passport); // pass passport for configuration
require('./config/connectDB'); // connect database

app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs'); // sử dụng view ejs


app.use(cookieParser()); //Parse cookie
app.use(bodyParser.urlencoded({ extended: false })); //Parse body để get data
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat', key: 'sid', maxAge : 1800000 }));  //Save user login
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use(express.static('assets'))

const auth = require('./app/routes/auth')(passport);
const user = require('./app/routes/user');
const product = require('./app/routes/product');
const blog = require('./app/routes/blog');
const order = require('./app/routes/order');

app.use('/api/', auth);
app.use('/api/user', user);
app.use('/api/product', product);
app.use('/api/blog', blog);
app.use('/api/order', order);

module.exports = app;