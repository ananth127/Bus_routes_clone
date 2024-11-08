const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busId: { type: String, required: true, unique: true },
  location: {
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
  },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // link to driver
});

module.exports = mongoose.model('Bus', busSchema);
