import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const amenityRatingSchema = new Schema({
  amenityId: { type: Schema.Types.ObjectId, ref: 'Amenity', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  societyId: { type: Schema.Types.ObjectId, ref: 'Society', required: true }, // Reference to society
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  cleanliness: { type: Number, min: 1, max: 5 },
  maintenance: { type: Number, min: 1, max: 5 },
  staff: { type: Number, min: 1, max: 5 },
  equipment: { type: Number, min: 1, max: 5 },
  review: { type: String },
  photos: [{ type: String }],
  response: {
    text: { type: String },
    respondedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    respondedAt: { type: Date }
  },
  isVerifiedBooking: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models?.AmenityRating || mongoose.model('AmenityRating', amenityRatingSchema);
