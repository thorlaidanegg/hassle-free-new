// models/worker.model.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const workerSchema = new Schema({
  workerID: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { 
    type: String, 
    enum: ['maintenance', 'security', 'cleaning', 'gardening'],
    required: true 
  },
  rating: { type: Number, min: 1, max: 5, default: 3 },
  noOfWorks: { type: Number, default: 0 },
  experience: { type: Number, required: true },
  activeComplaints: [{ type: Schema.Types.ObjectId, ref: 'Complaint' }],
  photo: {
    url: { type: String },
    faceData: { type: Buffer },
    lastUpdated: { type: Date }
  },
  societyId: { type: Schema.Types.ObjectId, ref: 'Society', required: true } // Linking to Society
}, { timestamps: true });

export default mongoose.models?.Worker || mongoose.model('Worker', workerSchema);