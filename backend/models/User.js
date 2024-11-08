// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['driver', 'student'], required: true },
  busId: { type: String },
  // role to differentiate user types
});

module.exports = mongoose.model('User', userSchema);
