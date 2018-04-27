var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
var bcrypt = require('bcryptjs');


var UserSchema = new mongoose.Schema({
    email: {
        type: String,  
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
        },
        message: `{VALUE} is not valid`
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    age:{
        type:Number
    }

});

UserSchema.pre('save', function (next) {
    console.log('in preeeee');

    var user = this;

    if (user.isModified('password')) {
        console.log('in ifffff');

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        });

    } else {
        console.log('in else');
        next();
    }
})

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAutoToken = function () {
    console.log('in method');
    var user = this;
    var access = "auth";
    var token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString();

    user.tokens.push({ access, token });
    console.log("////////////////////////////")
    console.log(token);
    return user.save().then(() => {
        console.log("--before returning token");
        return token;
    });
};

UserSchema.methods.removeToken = function (token){
    var user=this;

    return user.update({
        $pull:{
            tokens:{token}
        }
    });
};

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return Promise.reject();
    }


    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCrediantials = function (email, password) {
    var User = this;

    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject('invalid email');
        }

       return new Promise((resolve, reject) => {
            console.log("in promise for password");
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject('incorrect password');
                }
            })
        })
    });
}


var User = mongoose.model('User', UserSchema);

module.exports = { User };