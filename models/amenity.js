// models/amenity.model.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const amenitySchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: [
      'swimming_pool',
      'gym',
      'tennis_court',
      'squash_court',
      'football_field',
      'cricket_pitch',
      'clubhouse',
      'park',
      'basketball_court',
      'indoor_games',
      'yoga_room',
      'party_hall',
      'kids_play_area'
    ],
    required: true
  },
  description: { type: String, required: true },
  photos: [{
    url: { type: String },
    caption: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  capacity: { type: Number, required: true },
  timings: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    maintenanceTime: { type: String }
  }],
  rules: [{ type: String }],
  status: {
    type: String,
    enum: ['operational', 'maintenance', 'closed'],
    default: 'operational'
  },
  maintenanceSchedule: [{
    date: { type: Date },
    description: { type: String },
    duration: { type: Number } // in hours
  }],
  pricing: {
    isChargeable: { type: Boolean, default: false },
    hourlyRate: { type: Number },
    monthlyRate: { type: Number },
    yearlyRate: { type: Number }
  },
  location: { type: String, required: true },
  amenityManager: { type: Schema.Types.ObjectId, ref: 'Worker' }
}, { timestamps: true });


export default mongoose.models?.Amenity || mongoose.model('Amenity', amenitySchema);