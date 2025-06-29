const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  bio: {
   type: String,
    trim: true,
    maxlength: 500
  },
  profileImage: {
   type: String,
    default: 'default-avatar.png' 
  }, 
});

module.exports = mongoose.model('User', userSchema);
