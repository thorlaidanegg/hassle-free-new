// models/unauthorizedEntry.model.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const unauthorizedEntryLogSchema = new Schema({
  entryTime: { type: Date, required: true, default: Date.now },
  exitTime: { type: Date },
  visitorName: { type: String },
  visitorPhoto: { type: String },
  idProofType: { 
    type: String, 
    enum: ['aadhar', 'driving_license', 'voter_id', 'pan_card', 'other']
  },
  idProofNumber: { type: String },
  purpose: { type: String, required: true },
  contactNumber: { type: String },
  vehicleNumber: { type: String },
  securityGuardId: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
  actionTaken: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending_verification', 'allowed', 'denied', 'escalated'],
    default: 'pending_verification'
  },
  remarks: { type: String }
}, { timestamps: true });

export default mongoose.models?.UnauthorizedEntry || mongoose.model('UnauthorizedEntry', unauthorizedEntryLogSchema);