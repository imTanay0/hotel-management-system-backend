import express from "express";

import {
  bookUser,
  getBookings,
  getAllCustomers,
  updateFoodOrder,
} from "../controllers/userController.js";

const router = express.Router();

// Room Allocation (Stage 3) ->
router.route("/book").post(bookUser);

// find users by id
// router.route('/details/:u_id').get(getUser)

// get All booking details
router.route("/bookings").get(getBookings);

// Get all customers (Booked + Residing)
router.route("/getallcustomers").get(getAllCustomers);

// update food order
router.route("/order-food/:u_id").post(updateFoodOrder);

export default router;
