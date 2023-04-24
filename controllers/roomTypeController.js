import RoomType from "../models/roomTypeModel.js";

export const createRoomType = async (req, res) => {
  const { roomType } = req.body;

  try {
    const newRoomType = await RoomType.create({
      room_type: roomType,
    });

    if (!newRoomType) {
      res
        .status(400)
        .json({ success: false, message: "Room type not created" });
    }

    res.status(201).json({
      success: true,
      newRoomType,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllRoomTypes = async (req, res) => {
  try {
    const roomTypes = await RoomType.find({});

    if (!roomTypes) {
      res.status(400).json({ success: false, message: "Room types not found" });
    }

    res.status(200).json({
      success: true,
      roomTypes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
