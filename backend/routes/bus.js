const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');

// Route to get bus location by busId
router.get('/location/:busId', async (req, res) => {
  const { busId } = req.params;
  console.log("fectcin !!",busId);

  try {
    // Find the bus by busId
    const bus = await Bus.findOne({ busId });

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    // Send back the bus location
    res.status(200).json(bus.location);
    console.log(bus.location,bus.location.latitude);
  } catch (error) {
    console.error("Error fetching bus location:", error);
    res.status(500).json({ message: 'Failed to fetch bus location', error });
  }
});

module.exports = router;
