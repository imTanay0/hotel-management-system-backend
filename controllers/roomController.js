import Room from "../models/roomModel.js";

// Insert a new room
export const insertRoom = async (req, res) => {
  try {
    const { type_of_room, room_no, rate } = req.body;

    if (!type_of_room || !room_no || !rate) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newRoom = await Room.create({
      type_of_room,
      room_no,
      rate,
    });

    if (!newRoom) {
      return res
        .status(400)
        .json({ success: false, message: "Could not create new room" });
    }

    res.status(200).json({
      success: true,
      newRoom,
    });
  } catch (error) {
    res.status(error.status).json({
      success: false,
      message: error.message,
    });
  }
};

// get room details
export const getRoomDetails = async (req, res) => {
  try {
    const room = await Room.findById(req.params.r_id);

    if (!room) {
      console.log("Room not found");
      return;
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    res.status(error.status).json({
      success: false,
      message: error.message,
    });
  }
};
