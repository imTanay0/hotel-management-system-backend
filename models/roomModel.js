import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomNo: {
    type: String,
    required: true,
    unique: true,
  },
  roomType: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
    }
  },
  rate: {
    type: String,
    required: true,
  },
  bookingStatus: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Room", roomSchema);
