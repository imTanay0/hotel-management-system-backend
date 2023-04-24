import express from "express";

import { createRoomType, getAllRoomTypes } from "../controllers/roomTypeController.js";

const router = express.Router();

// Create new type of room
router.route("/add").post(createRoomType);

// Get All Types of Room
router.route("/getall").get(getAllRoomTypes);



export default router;
