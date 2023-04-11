import express from "express";

import { insertFood, getFoodDetails } from "../controllers/foodController.js";

const router = express.Router();

// food routeers ->

// insert food
router.route("/insert").post(insertFood);

//get food details
router.route("/details/:f_id").get(getFoodDetails);


export default router;
