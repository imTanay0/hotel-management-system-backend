import User from "../models/userModel.js";
import RoomType from "../models/roomTypeModel.js";
import Room from "../models/roomModel.js";
import Food from "../models/foodModel.js";
import { calcFoodBill, calcNoOfDays, calcRoomBill } from "../utils.js";

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

    if (contactNo.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

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

// Get a user by id
export const getCustomerById = async (req, res) => {
  const userId = req.params.u_id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Customer not found",
      });
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

  // if (phone_number.length !== 10 && local_contact_number.length !== 10) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Please enter a valid phone number",
  //   });
  // }

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
export const orderFood = async (req, res) => {
  const userId = req.params.u_id;

  const { date, time, roomNo, foodName, amount } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Validation for non-residing customers
    if (!user.roomAllocatedStatus) {
      return res.status(400).json({
        success: false,
        message: "Customer has not been allocated a room",
      });
    }

    const food = await Food.findOne({ name: foodName });

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food is not available",
      });
    }

    // Create new food object to add to user's list of ordered foods
    function createNewFood() {
      const obj = {
        date: date,
        time: time,
        room_no: roomNo,
        items_ordered: {
          food_name: foodName,
          food_id: food._id,
        },
        amount: amount,
      };
      return obj;
    }

    const newFood = createNewFood();

    await user.updateOne({ $push: { user_foods: newFood } });

    const userFoodResponse = {
      userFood: user.user_foods.concat(newFood),
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
// calculate total bill of user
export const getOneCustomerBill = async (req, res) => {
  const userId = req.params.u_id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (!user.roomAllocatedStatus) {
      return res.status(400).json({
        success: false,
        message: "Customer has not been allocated a room",
      });
    }

    let date2 = new Date();

    if (user.booking_to <= date2) {
      date2 = user.booking_to;
    }

    // Get price of the ordered food
    const getFoodPrices = user.user_foods.map(async (foodItem) => {
      let tempFoodPrices = {};
      try {
        const food = await Food.findById(foodItem.items_ordered.food_id);

        tempFoodPrices = {
          ...tempFoodPrices,
          foodName: food.name,
          foodPrice: food.price,
        };

        return tempFoodPrices;
      } catch (error) {
        console.log(error);
        return error;
      }
    });

    const foodPrices = await Promise.all(getFoodPrices);

    const data = {
      checkInDate: user.date_of_check_in,
      checkOutDate: user.booking_to,
      name: user.name,
      GSTINno: user.GSTIN_no,
      noOfDays: calcNoOfDays(user.date_of_check_in, date2),
      roomRent: user.rate_negotiated,
      roomBill: calcRoomBill(
        calcNoOfDays(user.date_of_check_in, date2),
        user.rate_negotiated
      ),
      foodBill: calcFoodBill(user.user_foods, foodPrices),
    };

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
