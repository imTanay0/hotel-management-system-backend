import User from "../models/userModel.js";
import Room from "../models/roomModel.js";

// Stage 3 -> Room Allocation
// book a user
export const createUser = async (req, res) => {
  try {
    const {
      name,
      phone_number,
      address,
      room_no,
      local_contact_number,
      date_of_check_in,
      company_name,
      rate_negotiated,
    } = req.body;

    const newUser = await User.create({
      name,
      // photo_identity,
      phone_number,
      address,
      room_no,
      local_contact_number,
      date_of_check_in,
      company_name,
      rate_negotiated,
    });

    const userRoom = await Room.findOne({ room_no: room_no });

    if (!userRoom) {
      return res.status(400).json({
        success: false,
        message: "Room not found",
      });
    }

    // update user room's booking status to true
    userRoom.booking_status = true;
    await userRoom.save();

    newUser.room = userRoom._id;
    await newUser.save();


    res.status(200).json({
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

    if (!user) {
      console.log("User not found");
      return;
    }

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
  try {
    const user = await User.findById(req.params.u_id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      })
    }

    if (user.booking_status === true) {
      return res.status(200).json({
        success: true,
        user: {
          date_of_booking: user.date_of_booking,
          // booking_from: user.booking_from,
          // bokking_to: user.bokking_to,
          user_name: user.name,
          contact_no: {
            phone_number: user.phone_number,
            local_contact_number: user.local_contact_number,
          },
          // type_of_room:
          rate_negotiated: user.rate_negotiated
        }
      });
    }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Stage 4 -> Food
// update food order for user
export const updateFoodOrder = async (req, res) => {};

// Stage 5 -> Billing
// calculate total amount of user
export const userBill = async (req, res) => {};
