import mongoose from "mongoose";

const currDate = new Date().toDateString();

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
  date_of_booking: {
    type: Date,
    default: currDate,
  },
  date_of_check_in: {
    type: Date,
  },
  company_name: {
    type: String,
  },
  rate_negotiated: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("User", userSchema);
