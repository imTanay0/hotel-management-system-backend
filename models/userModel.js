import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  room_no: {
    type: String,
    required: true,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
  local_contact_number: {
    type: String,
  },
  food: [
    {
      food_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Food",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  date_of_check_in: {
    type: Date,
  },
  company_name: {
    type: String,
  },
  GSTIN_no: {
    type: String,
  },
});

export default mongoose.model("User", userSchema);
