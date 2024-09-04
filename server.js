// server.js

const express = require('express');
const connectDB = require('./app/config/db');
const userRoutes = require('./app/routes/userRoutes');

// Initialize Express application
const app = express();

// Use JSON middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use routes
app.use('/api', userRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
