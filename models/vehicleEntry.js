// models/vehicleEntry.model.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const vehicleEntryLogSchema = new Schema({
  vehicleNumber: { type: String, required: true },
  entryTime: { type: Date, required: true, default: Date.now },
  exitTime: { type: Date },
  type: { 
    type: String, 
    enum: ['resident', 'guest', 'service', 'unauthorized'],
    required: true 
  },
  purpose: { type: String },
  residentId: { type: Schema.Types.ObjectId, ref: 'User' },
  guestId: { type: Schema.Types.ObjectId, ref: 'Guest' },
  capturedImage: { type: String },
  ocrConfidence: { type: Number },
  securityGuardId: { type: Schema.Types.ObjectId, ref: 'Worker' },
  remarks: { type: String },
  societyId: { type: Schema.Types.ObjectId, ref: 'Society', required: true } // New field
}, { timestamps: true });




export default mongoose.models?.VehicleEntryLog || mongoose.model('VehicleEntryLog', vehicleEntryLogSchema);