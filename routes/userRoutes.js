import express from "express";

import {
  bookUser,
  getCustomerById,
  getBookings,
  getAllCustomers,
  allocateRoom,
  getAllResidents,
  orderFood,
  getCustomerBill,
} from "../controllers/userController.js";


const router = express.Router();


// Room Allocation (Stage 3) ->
router.route("/book").post(bookUser);

// Get customer by id
router.route("/getdetail/:u_id").get(getCustomerById);

// get All booking details
router.route("/bookings").get(getBookings);

// Get all customers (Booked + Residing)
router.route("/getallcustomers").get(getAllCustomers);

// Allocate Room to a customer
router.route("/allocateroom").post(allocateRoom);

// Get all the residents
router.route("/getallresidents").get(getAllResidents);

// update food order
router.route("/order-food/:u_id").post(orderFood);

// Get customer bill by id
router.route("/getbill/:u_id").get(getCustomerBill);

export default router;
