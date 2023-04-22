import express from "express";

import { bookUser, getUser, getUserBookingDetails, updateFoodOrder } from "../controllers/userController.js"

const router = express.Router();

// Room Allocation (Stage 3) ->
router.route("/book").post(bookUser);

// find users by id
// router.route('/details/:u_id').get(getUser)

// get user's booking details
router.route('/details').get(getUserBookingDetails)

// update food order
router.route('/order-food/:u_id').post(updateFoodOrder);


export default router;