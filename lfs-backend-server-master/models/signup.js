const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema
const Schema = mongoose.Schema;
const SignUpSchema = new Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String
    },
    email:{
        type:String,
        required:true,
        index:{
            unique:true,
        }
    },
    number:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

SignUpSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

SignUpSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Model
const SignUp = mongoose.model('SignUp', SignUpSchema);

module.exports = SignUp;