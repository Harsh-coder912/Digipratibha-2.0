import mongoose, { Document, Model, Schema } from 'mongoose';

export interface FeedbackDocument extends Document {
  user: mongoose.Types.ObjectId;
  message: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<FeedbackDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

export const Feedback: Model<FeedbackDocument> =
  mongoose.models.Feedback || mongoose.model<FeedbackDocument>('Feedback', FeedbackSchema);


