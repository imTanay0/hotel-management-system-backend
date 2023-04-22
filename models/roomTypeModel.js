import mongoose, { Mongoose } from "mongoose";

const roomTypeSchema = new mongoose.Schema({
  room_type: {
    type: String,
    required: true,
  },
  room_no: [
    {
      no: {
        type: String,
      },
      room_no_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
    },
  ],
});

export default mongoose.model("RoomType", roomTypeSchema);
