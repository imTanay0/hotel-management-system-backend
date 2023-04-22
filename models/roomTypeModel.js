import mongoose, { Mongoose } from "mongoose";

const roomTypeSchema = new mongoose.Schema({
  roomType: {
    type: String,
    required: true,
  },
});

export default mongoose.model("RoomType", roomTypeSchema);
