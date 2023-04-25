import Room from "../models/roomModel.js";
import RoomType from "../models/roomTypeModel.js";

// Insert a new room
export const insertRoom = async (req, res) => {
  try {
    const { roomNo, roomType, rate } = req.body;

    if (!roomNo || !roomType || !rate) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existRoom = await Room.findOne({ roomNo });

    if (existRoom) {
      return res
        .status(400)
        .json({ success: false, message: "Room already exists" });
    }

    const roomTypeCheck = await RoomType.findOne({ room_type: roomType });

    if (!roomTypeCheck) {
      return res.status(400).json({
        success: false,
        message: "Type of Room not found, Enter a valid room type",
      });
    }

    const roomTypeId = roomTypeCheck._id;

    const newRoom = await Room.create({
      roomNo,
      roomType: {
        name: roomType,
        id: roomTypeId,
      },
      rate,
    });

    if (!newRoom) {
      return res
        .status(400)
        .json({ success: false, message: "Could not create new room" });
    }

    // Add roomNo to RoomType array
    const newArr = [
      {
        no: newRoom.roomNo,
        room_no_id: newRoom._id,
      },
    ];

    await RoomType.findByIdAndUpdate(roomTypeId, {
      $push: { room_no: newArr },
    });

    res.status(200).json({
      success: true,
      newRoom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get room details
export const getRoomDetails = async (req, res) => {
  try {
    const rooms = await Room.find();

    if (!rooms) {
      console.log("Rooms not found");
      return;
    }

    res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    res.status(error.status).json({
      success: false,
      message: error.message,
    });
  }
};
