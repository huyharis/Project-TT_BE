var LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;

const JWTStrategy   = passportJWT.Strategy;
const bCrypt = require('bcrypt');
// config
const configAuth = require('./auth');
const User = require('../app/models/user');

const isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.local.password);
}

const createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports = function (passport) {

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // FACEBOOK
    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ['id','displayName','email','first_name','last_name','middle_name']
    },
    // Facebook sẽ gửi lại chuối token và thông tin profile của user
    function (token, refreshToken, profile, done) {
        console.log(refreshToken);
        // asynchronous
        process.nextTick(function () {
            User.findOne({'facebook.id': profile.id}, function (err, user) {
                if (err)
                    return done(err);

                // Nếu tìm thấy user, cho họ đăng nhập
                if (user) {
                    console.log('login')
                    return done(null, user); // user found, return that user
                } else {
                    // nếu chưa có, tạo mới user
                    var newUser = new User();

                    // lưu các thông tin cho user
                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = token;
                    newUser.facebook.fullname = profile.displayName;
                    newUser.facebook.email = profile.emails[0].value;
                    console.log('save')
                    // lưu vào db
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        // nếu thành công, trả lại user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));
    console.log(configAuth.googleAuth.clientID,configAuth.googleAuth.clientSecret,configAuth.googleAuth.callbackURL)
    // GOOGLE
    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        //profileFields: ['id','displayName','email','first_name','last_name','middle_name']
    },
    function (token, refreshToken, profile, done) {
        //process nay lam gif as?
    
        // process.nextTick(function () {
            console.log('profile', profile)
            User.findOne({'google.id': profile.id}, function (err, user) {
                if (err)
                    return done(err);

                // Nếu tìm thấy user, cho họ đăng nhập
                console.log(user)
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // nếu chưa có, tạo mới user
                    var newUser = new User();

                    // lưu các thông tin cho user
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.fullname = profile.displayName;
                    newUser.google.email = profile.emails[0].value; 
                    newUser.photos = profile.photos[0].value;
                    console.log(newUser)
                    // lưu vào db
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        // nếu thành công, trả lại user
                        return done(null, newUser);
                    });
                }

            //});
        })
    }));

    // Login Local
    passport.use('local-login', new LocalStrategy({
        session: false,
        passReqToCallback: true
    },
    function(req, username, password, done) { 
        process.nextTick(function () {
            console.log('username', username, 'password', password)
            User.findOne({ 'local.username': username }, 
                function(err, user) {
                
                    // In case of any error, return using the done method
                    if (err)
                        return done(null, false);
                    // Username does not exist, log error & redirect back
                    if (!user){
                        console.log('User Not Found with username ' + username);
                        return done(null, false);
                        //return done(null, false, req.flash('message', 'User Not found.'));                 
                    }
                    console.log('data', user)
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false);
                        //return done(null, false, req.flash('message', 'Invalid Password'));
                    }

                 return done(null, user);
            })
        })
    }));

    // Signup
    passport.use('local-signup', new LocalStrategy({
        passReqToCallback: true // cho phép chúng ta gửi reqest lại hàm callback
    },
    function (req, username, password, done) {
        process.nextTick(function () {
            console.log('username', username, 'password', password)
            // Tìm một user theo email
            // chúng ta kiểm tra xem user đã tồn tại hay không
            User.findOne({'local.username': username}, function (err, user) {
                if (err)
                    return done(null, false);
                if (user) {
                    return done(null, false);
                } else {
                    // Nếu chưa user nào sử dụng email này
                    // tạo mới user
                    var newUser = new User();
                    // lưu thông tin cho tài khoản local
                    newUser.local.username = username;
                    newUser.local.password = createHash(password);
                    // lưu user
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    //
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'secretkey'
    },
    function (jwtPayload, cb) {
        //find the user in db if needed
        return User.findOneById(jwtPayload.id)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));
}