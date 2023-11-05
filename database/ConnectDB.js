import mongoose from "mongoose";

const DB_URI = process.env.DB_URI

const connectDB = () => {
  mongoose.connect(process.env.DB_URI1, { useNewUrlParser: true }).then((data) => {
    console.log("MongoDB connected with " + data.connection.host);
  });
};

export default connectDB;
