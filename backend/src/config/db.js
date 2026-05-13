import mongoose from 'mongoose';

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB ulandi: ${conn.connection.host}`);
};

export default connectDB;
