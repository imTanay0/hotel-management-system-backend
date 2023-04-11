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
  user_foods: [
    {
      date: {
        type: Date,
      },
      time: {
        type: String,
      },
      room_no: {
        type: String,
      },
      items_ordered: {
        food_name: {
          type: String,
        },
        food_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
        },
      },
      amount: {
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
