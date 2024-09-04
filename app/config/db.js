// config/db.js

const mongoose = require('mongoose');

// MongoDB connection URL
const mongoURL = 'mongodb://127.0.0.1:27017/local'; // Replace 'mydatabase' with your actual database name

// Function to connect to MongoDB
const connectDB = async () => {
  try {
   let dbe = await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB successfully');

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    // Listen for connection error
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    // Listen for disconnection
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit process with failure
  }
};

// Export the connection function
module.exports = connectDB;
