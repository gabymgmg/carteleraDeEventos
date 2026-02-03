import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

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
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['owner', 'admin'],
      default: 'owner',
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Do not return password field by default
    },
    // Optional fields
    description: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    businessName: {
      type: String,
      trim: true,
    },
    businessAddress: {
      type: String,
      trim: true,
    },
    // These fields stay empty until a user requests a reset
    resetPasswordToken: { 
      type: String, 
      default: undefined 
    },
    resetPasswordExpires: { 
      type: Date, 
      default: undefined 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

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
