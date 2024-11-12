// models/guest.model.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const guestSchema = new Schema({
  guestId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  noOfPeople: { type: Number, required: true },
  timestamps: {
    entry: { type: Date },
    exit: { type: Date }
  },
  date: { type: Date, required: true },
  qrCode: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'checked-in', 'checked-out'],
    default: 'pending'
  },
  carNo: { type: String },
  purpose: { type: String },
  validUntil: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.models?.Guest || mongoose.model('Guest', guestSchema);