import mongoose from "mongoose";

const currentDate = new Date().toDateString();

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
  },
  room_no: {
    no: {
      type: String,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  room_type: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
    },
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
    default: currentDate,
  },
  booking_from: {
    type: Date,
  },
  booking_to: {
    type: Date,
  },
  rate_negotiated: {
    type: Number,
  },
  date_of_check_in: {
    type: Date,
  },
  company_name: {
    type: String,
  },
  GSTIN_no: {
    type: String,
  },
  roomAllocatedStatus: {
    type: Boolean,
    default: false,
  }
});

export default mongoose.model("User", userSchema);
