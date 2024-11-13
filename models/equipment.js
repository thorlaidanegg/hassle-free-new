// models/equipment.model.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const equipmentSchema = new Schema({
  name: { type: String, required: true },
  amenityId: { type: Schema.Types.ObjectId, ref: 'Amenity', required: true },
  type: {
    type: String,
    enum: [
      'sports_equipment',
      'gym_equipment',
      'game_equipment',
      'furniture',
      'electronic',
      'cleaning',
      'safety',
      'other'
    ],
    required: true
  },
  description: { type: String },
  photo: { type: String },
  quantity: {
    total: { type: Number, required: true },
    available: { type: Number, required: true },
    underMaintenance: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['available', 'low_stock', 'out_of_stock', 'maintenance'],
    default: 'available'
  },
  isChargeable: { type: Boolean, default: false },
  charges: {
    hourly: { type: Number },
    deposit: { type: Number }
  },
  purchaseInfo: {
    date: { type: Date },
    vendor: { type: String },
    warranty: {
      startDate: { type: Date },
      endDate: { type: Date },
      document: { type: String }
    },
    cost: { type: Number }
  },
  societyId: { type: Schema.Types.ObjectId, ref: 'Society', required: true } // Linking to Society
}, { timestamps: true });


export default mongoose.models?.Equipment || mongoose.model('Equipment', equipmentSchema);
