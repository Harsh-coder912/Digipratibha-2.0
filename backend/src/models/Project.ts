import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ProjectDocument extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  techStack: string[];
  repoUrl?: string;
  liveUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<ProjectDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    techStack: { type: [String], default: [] },
    repoUrl: { type: String },
    liveUrl: { type: String },
  },
  { timestamps: true }
);

ProjectSchema.index({ techStack: 1 });

export const Project: Model<ProjectDocument> =
  mongoose.models.Project || mongoose.model<ProjectDocument>('Project', ProjectSchema);



