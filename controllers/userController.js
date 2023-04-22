import User from "../models/userModel.js";
import RoomType from "../models/roomTypeModel.js";
import Room from "../models/roomModel.js";
import Food from "../models/foodModel.js";

// Stage 2 -> Book User
// book a user
export const bookUser = async (req, res) => {
  try {
    const {
      dateOfBooking,
      bookingFrom,
      bookingTo,
      customerName,
      contactNo,
      roomTypeName,
      rateNegotiated,
    } = req.body;

    // Check if desired room is available or not.
    const roomType = await RoomType.findOne({ room_type: roomTypeName });

    if (!roomType) {
      return res.status(400).json({
        success: false,
        message: "The provided type of room is not available, Please select a different type of room."
      });
    }

    const newUser = await User.create({
      date_of_booking: dateOfBooking,
      booking_from: bookingFrom,
      booking_to: bookingTo,
      name: customerName,
      phone_number: contactNo,
      room_type: {
        name: roomTypeName,
        id: roomType._id,
      },
      rate_negotiated: rateNegotiated,
    });

    res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get user details
export const getUser = async (req, res) => {
  try {
    // search by id
    const user = await User.findById(req.params.u_id);

    // if (!user) {
    //   console.log("User not found");
    //   return;
    // }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Stage 2 -> Booking
// user's booking details if booking status is true
export const getUserBookingDetails = async (req, res) => {
  const u_id = req.params.u_id;

  const userId = req.query.userID;

  try {
    // const user = await User.findById(u_id);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const currDate = new Date().toDateString();

    // get User's type of room from Room
    const roomNo = user.room_no;

    const userRoom = await Room.findOne({ room_no: roomNo });

    if (!userRoom) {
      return res.status(401).json({
        success: false,
        message: "Room not found",
      });
    }

    const roomType = userRoom.type_of_room;

    return res.status(200).json({
      success: true,
      user: {
        date_of_booking: user.date_of_booking.toDateString(),
        booking_from: user.date_of_check_in.toDateString(),
        bokking_to: currDate,
        user_name: user.name,
        contact_no: {
          phone_number: user.phone_number,
          local_contact_number: user.local_contact_number,
        },
        type_of_room: roomType,
        rate_negotiated: user.rate_negotiated,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Stage 4 -> Food
// update food order for user
export const updateFoodOrder = async (req, res) => {
  const userId = req.params.u_id;

  const { date, time, room_no, food_name, amount } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const food = await Food.findOne({ name: food_name });

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    // Create new food object to add to user's list of ordered foods
    const newFood = {
      date: date,
      time: time,
      room_no: room_no,
      items_ordered: {
        food_name: food_name,
        food_id: food._id,
      },
      amount: amount,
    };

    await user.updateOne({ $push: { user_foods: newFood } });

    const userFoodResponse = {
      userFood: user.user_foods.map((food) => food),
    };

    res.status(200).json({
      success: true,
      user_name: user.name,
      userFoodResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Stage 5 -> Billing
// calculate total amount of user
export const userBill = async (req, res) => {};
