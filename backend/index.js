const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const busRoutes = require('./routes/bus');
const mapRoutes = require('./routes/map');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.mongodb_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/auth', authRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/map', mapRoutes);

app.listen(5000, () => console.log('Server started on port 5000'));
