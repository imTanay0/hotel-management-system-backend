import express from "express";

import { insertFood, getFoodDetails, getAllFoods } from "../controllers/foodController.js";

const router = express.Router();

// food routeers ->

// insert food
router.route("/insert").post(insertFood);

//get a single food details by id
router.route("/details/:f_id").get(getFoodDetails);

// Get all food details
router.route("/allfoods").get(getAllFoods);


export default router;
