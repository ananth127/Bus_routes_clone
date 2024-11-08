// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();
const Bus = require('../models/Bus');

router.post('/signup', async (req, res) => {
  const { username, password, role, busId, latitude, longitude } = req.body;

  try {
    if (role === 'student') {
      const bus = await Bus.findOne({ busId });
      
      if (!bus) {
        console.log("Bus not found");
        return res.status(404).json({ message: 'Bus not found' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword, role, busId });
      await user.save();
      
      console.log(user.busId, "student");
      res.status(201).json({ message: 'Student registered successfully' });

    } else if (role === 'driver') {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword, role, busId });
      await user.save();

      let bus = await Bus.findOne({ busId });
      if (!bus) {
        // If the bus doesn't exist, create a new entry
        console.log("Bus not found, creating new entry...", busId);
        bus = new Bus({
          busId,
          location: { latitude, longitude },
        });
      } else {
        // Update existing bus location
        bus.location.latitude = latitude;
        bus.location.longitude = longitude;
      }

      await bus.save();
      console.log("Location updated:", latitude, longitude);
      res.status(200).json({ message: 'Driver registered successfully', bus });

    } else {
      res.status(400).json({ message: 'Invalid role' });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password, role, busId } = req.body;

  try {
    const user = await User.findOne({ username, role });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log(busId, user._id, username, role);

    if (role === 'driver') {
      console.log(busId, user._id, "Driver login");
      res.status(200).json({ message: 'Driver logged in', userId: user._id, busID: busId });

    } else if (role === 'student') {
      console.log(user.busId, "Student login");
      res.status(200).json({ message: 'Student logged in', userId: user._id, busID: user.busId });

    } else {
      res.status(400).json({ message: 'Invalid role' });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
