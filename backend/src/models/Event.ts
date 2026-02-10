import mongoose, { Schema, Document } from 'mongoose';

export interface Event extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  category: string;
  imageUrl?: string;
  owner: mongoose.Types.ObjectId; // Reference to User
  createdAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  }, { timestamps: true });

export default mongoose.model<Event>('Event', EventSchema);