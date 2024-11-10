// models/announcement.model.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const announcementSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  attachments: [{ type: String }],
  notifyUsers: { type: Boolean, default: false },
  audience: {
    type: String,
    enum: ['all', 'specific_blocks', 'specific_users'],
    default: 'all'
  },
  targetedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.models?.Announcement|| mongoose.model('Announcement', announcementSchema);