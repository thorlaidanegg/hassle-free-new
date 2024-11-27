import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const formSubmissionSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  formId: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
  content: { type: String, required: true }
});

export default mongoose.models?.FormSubmission || mongoose.model('FormSubmission', formSubmissionSchema);
