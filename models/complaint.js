// models/complaint.model.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const complaintSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  photos: [{ type: String }],
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { 
    type: String, 
    enum: [
      'electrical',
      'plumbing',
      'carpentry',
      'housekeeping',
      'security',
      'lift',
      'parking',
      'noise',
      'pest_control',
      'common_area',
      'garden',
      'gymnasium',
      'swimming_pool',
      'other'
    ],
    required: true 
  },
  subCategory: { type: String },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  status: { 
    type: String, 
    enum: ['pending', 'assigned', 'in-progress', 'material_needed', 'resolved', 'closed'],
    default: 'pending'
  },
  location: { type: String, required: true },
  assignedWorker: { type: Schema.Types.ObjectId, ref: 'Worker' },
  estimatedCost: { type: Number },
  actualCost: { type: Number },
  resolution: { type: String },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String }
  }
}, { timestamps: true });


export default mongoose.models?.Complaint || mongoose.model('Complaint', complaintSchema);