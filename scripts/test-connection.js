console.log('Starting script...');

const mongoose = require('mongoose');
require('dotenv').config();

console.log('MongoDB URI:', process.env.MONGO_URI ? 'Set' : 'Not set');

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce')
  .then(() => {
    console.log('Connected to MongoDB');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Connection failed:', err);
    process.exit(1);
  });
