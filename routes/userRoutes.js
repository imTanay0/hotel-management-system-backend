import express from "express";

import { getUser } from "../controllers/userController.js"

const router = express.Router();

// user routes
router.route("/").get(getUser);



export default router;