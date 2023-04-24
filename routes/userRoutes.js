import express from "express";

import {
  bookUser,
  getBookings,
  getAllCustomers,
  allocateRoom,
  getAllResidents,
  updateFoodOrder,
} from "../controllers/userController.js";



const router = express.Router();

// Room Allocation (Stage 3) ->
router.route("/book").post(bookUser);

// get All booking details
router.route("/bookings").get(getBookings);

// Get all customers (Booked + Residing)
router.route("/getallcustomers").get(getAllCustomers);

// Allocate Room to a customer
router.route("/allocateroom").post(allocateRoom);

// Get all the residents
router.route("/getallresidents").get(getAllResidents);

// update food order
router.route("/order-food/:u_id").post(updateFoodOrder);

export default router;
