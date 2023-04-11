import express from "express";

import { createUser, getUser, getUserBookingDetails } from "../controllers/userController.js"

const router = express.Router();

// Room Allocation (Stage 3) ->
router.route("/register").post(createUser);

// find users by id
// router.route('/details/:u_id').get(getUser)

// get user's booking details
router.route('/details').get(getUserBookingDetails)


export default router;