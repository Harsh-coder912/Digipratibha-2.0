import mongoose, { Document, Model, Schema } from 'mongoose';

export interface CertificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  authority?: string;
  issueDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CertificationSchema = new Schema<CertificationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    authority: { type: String },
    issueDate: { type: Date },
    credentialId: { type: String },
    credentialUrl: { type: String },
  },
  { timestamps: true }
);

export const Certification: Model<CertificationDocument> =
  mongoose.models.Certification ||
  mongoose.model<CertificationDocument>('Certification', CertificationSchema);



