// models/admin.model.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    society: {
      name: { type: String, required: true }, // Name of the society
      address: { type: String, required: true }, // Full address of the society
      location: { 
        latitude: { type: Number, required: true }, // Latitude for geo-location
        longitude: { type: Number, required: true } // Longitude for geo-location
      },
      pincode: { type: String, required: true }, // Postal code for the society
    },
  },
  { timestamps: true }
);

export default mongoose.models?.Admin || mongoose.model('Admin', adminSchema);
