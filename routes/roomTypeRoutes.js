import express from "express";

import { createRoomType } from "../controllers/roomTypeController.js";

const router = express.Router();

// Create new type of room
router.route("/").post(createRoomType);



export default router;
