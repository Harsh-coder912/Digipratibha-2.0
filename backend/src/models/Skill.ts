import mongoose, { Document, Model, Schema } from 'mongoose';

export interface SkillDocument extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  level?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<SkillDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, index: true },
    level: { type: String },
  },
  { timestamps: true }
);

export const Skill: Model<SkillDocument> =
  mongoose.models.Skill || mongoose.model<SkillDocument>('Skill', SkillSchema);



