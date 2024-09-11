// models/userModel.js

const mongoose = require('mongoose');
const { type } = require('os');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
 age: Number,
 password:String,
 mobile:String,
 address:String,
 username:String,
 companyName:String,
 isDelete:{type:Boolean, default:false},
 isActive:{type:Boolean, default:true},
 role:{type:Number, default:3}

});

// Create the User model
const User = mongoose.model('users', userSchema);

// Export the model
module.exports = User;
