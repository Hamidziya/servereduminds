// models/userModel.js

const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
 // age: Number,
});

// Create the User model
const User = mongoose.model('users', userSchema);

// Export the model
module.exports = User;
