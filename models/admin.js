// models/admin.model.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    societyId: { type: Schema.Types.ObjectId, ref: 'Society', required: true }, // Reference to Society
  },
  { timestamps: true }
);

export default mongoose.models?.Admin || mongoose.model('Admin', adminSchema);
