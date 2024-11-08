const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');

// Route to update bus location
router.post('/update-location', async (req, res) => {
  const { latitude, longitude,busId } = req.body;
  console.log("Processing location update...");
   // Example bus ID, replace with dynamic ID if needed
console.log("bus Id server : ",busId);
  try {
    // Find the bus by busId
    let bus = await Bus.findOne({ busId });

    if (!bus) {
      // If the bus doesn't exist, create a new entry
      bus = new Bus({
        busId,
        location: { latitude, longitude },
      });
    } else {
      // Update existing bus location
      bus.location.latitude = latitude;
      bus.location.longitude = longitude;
    }

    // Save the updated bus location
    await bus.save();
    console.log("Location updated:", latitude, longitude);
    res.status(200).json({ message: 'Location updated successfully', bus });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ message: 'Failed to update location', error });
  }
});

module.exports = router;
