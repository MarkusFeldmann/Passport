var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local: {
        email: String,
        password: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String

    },
    o365: {
        id: String,
        accessToken: String,
        refreshToken: String,
        email: String,
        name: String,
        tokenParams: String,
        displayName: String
    }
});

userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, this.local.password);
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.hasToken = function(resourceUri) {
    if (user.tokens.hasOwnProperty(resourceUri)) {
        return true;
    } else {
        return false;
    }
};

module.exports = mongoose.model('User', userSchema);
