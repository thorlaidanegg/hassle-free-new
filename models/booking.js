// models/booking.model.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  amenityId: { type: Schema.Types.ObjectId, ref: 'Amenity', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookingDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  numberOfPeople: { type: Number, required: true },
  purpose: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
    default: 'pending'
  },
  payment: {
    amount: { type: Number },
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'not_required'],
      default: 'not_required'
    },
    transactionId: { type: String },
    paidAt: { type: Date }
  },
  guests: [{
    name: { type: String },
    relation: { type: String }
  }],
  equipment: [{
    itemId: { type: Schema.Types.ObjectId, ref: 'Equipment' },
    quantity: { type: Number }
  }],
  cancellationReason: { type: String },
  cancelledAt: { type: Date },
  reminderSent: { type: Boolean, default: false },
  societyId: { type: Schema.Types.ObjectId, ref: 'Society', required: true } // New field
}, { timestamps: true });



export default mongoose.models?.Booking || mongoose.model('Booking', bookingSchema);