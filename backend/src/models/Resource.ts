import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ResourceDocument extends Document {
  title: string;
  type: 'video' | 'article' | 'pdf' | 'link' | 'other';
  link: string;
  uploadedBy: mongoose.Types.ObjectId;
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<ResourceDocument>(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['video', 'article', 'pdf', 'link', 'other'], default: 'other' },
    link: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    embedding: { type: [Number], index: false },
  },
  { timestamps: true }
);

export const Resource: Model<ResourceDocument> =
  mongoose.models.Resource || mongoose.model<ResourceDocument>('Resource', ResourceSchema);


