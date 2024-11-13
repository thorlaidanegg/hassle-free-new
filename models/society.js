// models/society.model.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const societySchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    pincode: { type: String, required: true },
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true }, // Reference to Admin
  },
  { timestamps: true }
);

export default mongoose.models?.Society || mongoose.model('Society', societySchema);
