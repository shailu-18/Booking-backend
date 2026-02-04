const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  contactNumber: { type: String, required: true},
  destination: { type: String, required: true },
  tripDuration: { type: Number, required: true },
  travelDate: { type: Date, required: true },
  numberOfPeople: { type: Number, required: true },
  travellers: [
    {
      name: { type: String, required: true },
      age: { type: Number, required: true },
    }
  ],
  travelDate: { type: Date, required: true },
  specialRequests: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
