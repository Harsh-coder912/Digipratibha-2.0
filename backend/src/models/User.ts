import mongoose, { Document, Model, Schema } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  role: 'student' | 'admin';
  bio?: string;
  skills: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    bio: { type: String },
    skills: { type: [String], default: [] },
    socialLinks: {
      github: { type: String },
      linkedin: { type: String },
      portfolio: { type: String },
    },
    profilePicture: { type: String },
  },
  { timestamps: true }
);

UserSchema.index({ skills: 1 });
UserSchema.index({ username: 1 });

export const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);


