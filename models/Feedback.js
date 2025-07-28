const mongoose = require('mongoose');

// Define schema
const feedbackSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  
}, { timestamps: true });

// Export model
module.exports = mongoose.model('Feedback', feedbackSchema);
