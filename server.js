require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes

// GET all bookings
app.get('/api/bookings', async (_, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      destination,
      tripDuration,
      numberOfPeople,
      travelers,
      travelDate,
      specialRequests
    } = req.body;

    // Optional: Validate that numberOfPeople === travelers.length

    if (numberOfPeople !== travelers.length) {
      return res.status(400).json({ error: 'Number of people does not match traveler details.' });
    }

    const newBooking = new Booking({
      customerName,
      customerEmail,
      destination,
      tripDuration,
      numberOfPeople,
      travelers,
      travelDate,
      specialRequests
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a booking by ID
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Booking not found' });
    res.json({ msg: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`BookAndGo server running on port ${PORT}`));
