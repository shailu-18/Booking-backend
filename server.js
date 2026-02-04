require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Feedback = require('./models/Feedback');
const Booking = require('./models/Booking');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    console.log("Received booking:", req.body);

    const {
      destination,
      tripDate,
      duration,
      travellers,
      contactNumber,
      email
    } = req.body;

    if (!travellers || travellers.length === 0) {
      return res.status(400).json({ error: "No travellers provided" });
    }

    console.log("customerName:", travellers[0].name);

    const bookingData = {
      customerName: travellers[0].name,
      customerEmail: email,
      contactNumber: String(contactNumber),
      destination,
      tripDuration: Number(duration),
      numberOfPeople: travellers.length,
      travellers: travellers,
      travelDate: new Date(tripDate)
    };

    console.log("Saving booking:", bookingData);

    const newBooking = new Booking(bookingData);
    await newBooking.save();

    res.status(201).json({ message: "Booking successful" });

  } catch (err) {
    console.error("FULL ERROR:", err);
    res.status(500).json({ error: err.message });
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

// POST feedback
app.post('/api/feedback', async (req, res) => {
  try {
   const { email, message } = req.body;

    const feedback = new Feedback({
  email,
  message
});

    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all feedback
app.get('/api/feedback', async (_, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbackList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
  console.log(`BookAndGo server running on port ${PORT}`)
);
