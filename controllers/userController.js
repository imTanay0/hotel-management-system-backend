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
        message:
          "The provided type of room is not available, Please select a different type of room.",
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
      rate_negotiated: Number(rateNegotiated),
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

// show all bookings
export const getBookings = async (req, res) => {
  try {
    const users = await User.find({ roomAllocatedStatus: false });

    if (!users) {
      return res.status(400).json({
        success: false,
        message: "No bookings found",
      });
    }

    const findAvailableRoomsForUser = async (userRoomType) => {
      try {
        // Find the room type document for the user's room type
        const roomType = await RoomType.findOne({
          room_type: userRoomType,
        }).populate("room_no.room_no_id");

        // Get an array of all room numbers associated with the room type
        const roomNos = roomType.room_no.map((room) => room.no);

        // Find all Room documents with those room numbers
        const rooms = await Room.find({ roomNo: { $in: roomNos } });

        // Filter out any rooms that are already booked
        const availableRooms = rooms.filter(
          (room) => room.bookingStatus === false
        );

        // Return the list of available room numbers
        const availableRoomNos = availableRooms.map((room) => room.roomNo);
        return availableRoomNos;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to find available rooms for user");
      }
    };

    // Create an object to store available rooms for each user
    const availableRoomsByUser = {};

    // Iterate through each user and find available rooms
    for (const user of users) {
      const availableRooms = await findAvailableRoomsForUser(
        user.room_type.name
      );

      // Add the available rooms to the object with the user's name as the key
      availableRoomsByUser[user.name] = availableRooms;
    }

    // Send the available rooms by user in the response
    res.status(200).json({
      success: true,
      users,
      availableRoomsByUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Customers
export const getAllCustomers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Stage 3
// Allocate Rooms to Customers
export const allocateRoom = async (req, res) => {
  const {
    name,
    phone_number,
    address,
    room_no,
    local_contact_number,
    date_of_check_in,
    company_name,
    GSTIN_no,
  } = req.body;

  try {
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "The customer has not booked yet",
      });
    }

    if (user.roomAllocatedStatus) {
      return res.status(400).json({
        success: false,
        message: "The Customer has already been allocated a room",
      });
    }

    const room = await Room.findOne({ roomNo: room_no });

    if (!room) {
      return res.status(400).json({
        success: false,
        message: "The room is not available",
      });
    }

    if (room.bookingStatus) {
      return res.status(400).json({
        success: false,
        message: "The room is already booked",
      });
    }

    const updatedRoom = await Room.findOneAndUpdate(
      { roomNo: room_no },
      { $set: { bookingStatus: true } },
      { new: true }
    );

    const updatedUser = await User.findOneAndUpdate(
      { name: name },
      {
        $set: {
          phone_number: phone_number,
          address: address,
          room_no: {
            no: room_no,
            id: updatedRoom._id,
          },
          local_contact_number: local_contact_number,
          date_of_check_in: date_of_check_in,
          company_name: company_name,
          GSTIN_no: GSTIN_no,
          roomAllocatedStatus: true,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all residents
export const getAllResidents = async (req, res) => {
  try {
    const users = await User.find({ roomAllocatedStatus: true });

    if (!users) {
      return res.status(400).json({
        success: false,
        message: "No Residents found",
      });
    }

    res.status(200).json({
      success: true,
      users,
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
