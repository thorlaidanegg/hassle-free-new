// models/amenityMaintenance.model.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const amenityMaintenanceSchema = new Schema({
  amenityId: { type: Schema.Types.ObjectId, ref: 'Amenity', required: true },
  type: {
    type: String,
    enum: ['routine', 'repair', 'replacement', 'cleaning', 'inspection', 'emergency'],
    required: true
  },
  description: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  completedDate: { type: Date },
  duration: { type: Number }, // in hours
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'delayed', 'cancelled'],
    default: 'scheduled'
  },
  assignedWorkers: [{
    workerId: { type: Schema.Types.ObjectId, ref: 'Worker' },
    role: { type: String }
  }],
  cost: {
    estimated: { type: Number },
    actual: { type: Number }
  },
  parts: [{
    name: { type: String },
    quantity: { type: Number },
    cost: { type: Number }
  }],
  notes: { type: String },
  photos: [{
    before: [{ type: String }],
    after: [{ type: String }]
  }],
  nextMaintenanceDate: { type: Date }
}, { timestamps: true });

amenityMaintenanceSchema.index({ amenityId: 1, scheduledDate: 1 });
amenityMaintenanceSchema.index({ status: 1 });

export default mongoose.models?.AmenityMaintenance || mongoose.model('AmenityMaintenance', amenityMaintenanceSchema);