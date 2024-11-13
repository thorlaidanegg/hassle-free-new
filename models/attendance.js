// models/attendance.model.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const attendanceLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: ['entry', 'exit'], required: true },
  location: { type: String, required: true },
  confidence: { type: Number },
  deviceId: { type: String },
  verificationMethod: {
    type: String,
    enum: ['facial_recognition', 'manual', 'qr_code', 'override'],
    required: true
  },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'Worker' },
  photo: { type: String },
  status: {
    type: String,
    enum: ['verified', 'failed', 'manual_override'],
    required: true
  },
  societyId: { type: Schema.Types.ObjectId, ref: 'Society', required: true } // New field
}, { timestamps: true });




export default mongoose.models?.AttendanceLog || mongoose.model('AttendanceLog', attendanceLogSchema);