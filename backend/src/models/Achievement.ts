import mongoose, { Document, Model, Schema } from 'mongoose';

export interface AchievementDocument extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  date?: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema = new Schema<AchievementDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    date: { type: Date },
    description: { type: String },
  },
  { timestamps: true }
);

export const Achievement: Model<AchievementDocument> =
  mongoose.models.Achievement || mongoose.model<AchievementDocument>('Achievement', AchievementSchema);


