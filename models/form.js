const mongoose = require('mongoose');
const { Schema } = mongoose;

const formSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  published: { type: Boolean, default: false },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  content: { type: String, default: "[]" },
  visits: { type: Number, default: 0 },
  submissions: { type: Number, default: 0 },
  shareURL: { type: String, default: () => require('uuid').v4() },
  formSubmissions: [{ type: Schema.Types.ObjectId, ref: 'FormSubmission' }]
});

export default mongoose.models?.Form || mongoose.model('Form', formSchema);