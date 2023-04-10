import express from "express";

import { getUser, createUser } from "../controllers/userController.js"

const router = express.Router();

// Room Allocation (Stage 3) ->
router.route("/register").post(createUser);

// find users by id
router.route('/details/:u_id').get(getUser)

// find by name
router.route('/details').get(getUser)


export default router;