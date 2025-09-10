const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const mongoURI = `${process.env.URI}`;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); 
  }
};
connectDB();

const hitSchema = new mongoose.Schema({
  userAgent: {
    type: String,
    required: true,
  },
  language: String,
  screenWidth: Number,
  screenHeight: Number,
  ipAddress: String,
  country: String,
  city: String,
}, {
  timestamps: true
});

const Hit = mongoose.model('Hit', hitSchema);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
// app.use(cors({
//   // origin: 'https://hackathon.gitjaipur.com',
//   origin: '*',
// }));
app.use(cors());

// Tracking API endpoint
app.post('/api/track', async (req, res) => {
  try {
    const { userAgent, language, screenWidth, screenHeight, ipAddress, country, city } = req.body;

    const newHit = new Hit({
      userAgent,
      language,
      screenWidth,
      screenHeight,
      ipAddress,
      country,
      city,
    });

    await newHit.save();
    console.log('New hit saved:', newHit);

    res.status(201).json({ message: 'Hit saved successfully!' });
  } catch (error) {
    console.error('Error saving hit:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Root endpoint for testing
app.get('/', (req, res) => {
  res.send('Tracking API is running...');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
