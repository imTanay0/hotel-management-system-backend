import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  room_no: {
    type: String,
    required: true,
    unique: true,
  },
  rate: {
    type: String,
    required: true,
  },
  booking_status: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Room", roomSchema);
