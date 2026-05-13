import mongoose from 'mongoose';

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    tls: true,
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`MongoDB ulandi: ${conn.connection.host}`);
};

export default connectDB;
