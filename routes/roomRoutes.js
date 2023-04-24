import express from 'express'

import { insertRoom, getRoomDetails } from '../controllers/roomController.js';

const router = express.Router();

// Room Routes ->

// create a new room
router.route('/add').post(insertRoom);

// get a room details
router.route('/getall').get(getRoomDetails);


export default router;