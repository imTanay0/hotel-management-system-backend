import mongoose from "mongoose";

const foodSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  }
})

export default mongoose.model('Food', foodSchema);