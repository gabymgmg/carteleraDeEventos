import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.DB_MONGO_URI as string);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${(error as Error).message}`);
    process.exit(1); // Stop server if DB fails
  }
};

export default connectDB;