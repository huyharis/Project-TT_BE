const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

const UserSchema = new Schema({
    facebook : {
        id: String,
        fullname: String,
        email: String,
        token: String
    },
    google: {
        id: String,
        fullname: String,
        email: String,
        token: String,
        photos: String
    },
    local: {
        username: String,
        password: String,
        fullname: String,
        isAdmin: {
            type: Boolean,
            default: true
        }
    }
});

UserSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('myprivatekey')); //get the private key from the config file -> environment variable
    return token;
}

var User = mongoose.model('user', UserSchema);
module.exports = User;

