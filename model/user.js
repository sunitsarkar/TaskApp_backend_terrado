const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({

    name:{
        type: String,
        default: null
    },
    email:{
        type: String,
        default: null
    },   
    password:{
        type: String,
        require: true
    },
  
},{timestamps: true, versionkey: false})


module.exports = mongoose.model('UserData', UserSchema);