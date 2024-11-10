// models/user.model.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  password: { type: String, required: true },
  houseNo: { type: String, required: true },
  flatNo: { type: String, required: true },
  photo: {
    url: { type: String, required: true },
    faceData: { type: Buffer },
    lastUpdated: { type: Date },
    isVerified: { type: Boolean, default: false }
  },
  noOfCars: { type: Number, default: 0 },
  carNumbers: [{ type: String }],
}, { timestamps: true });



export default mongoose.models?.User || mongoose.model('User', userSchema);