import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { kMaxLength } from 'node:buffer';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'owner' | 'admin';
  password: string;
  description?: string;
  avatarUrl?: string;
  businessName?: string;
  businessAddress?: string;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['owner', 'admin'],
    default: 'owner'
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // Optional fields
  description: {
    type: String,
    maxlength: 500,
    trim: true
  },
  avatarUrl: {
    type: String,
    trim: true
  },
  businessName: {
    type: String,
    trim: true
  },
  businessAddress: {
    type: String,
    trim: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);