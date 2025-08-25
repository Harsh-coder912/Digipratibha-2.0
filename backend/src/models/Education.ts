import mongoose, { Document, Model, Schema } from 'mongoose';

export interface EducationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  school: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EducationSchema = new Schema<EducationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    school: { type: String, required: true },
    degree: { type: String },
    fieldOfStudy: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String },
  },
  { timestamps: true }
);

export const Education: Model<EducationDocument> =
  mongoose.models.Education || mongoose.model<EducationDocument>('Education', EducationSchema);



