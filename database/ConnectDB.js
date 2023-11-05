import mongoose from "mongoose";

const connectDB = () => {
  mongoose
    .connect(process.env.DB_URI2, { useNewUrlParser: true })
    .then((data) => {
      console.log("MongoDB connected with " + data.connection.host);
    });
};

export default connectDB;
