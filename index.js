import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./database/ConnectDB.js";

import roomTypeRoutes from "./routes/roomTypeRoutes.js"
import roomRoutes from "./routes/roomRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";

// Config
dotenv.config({ path: "database/.env" });

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/roomtype", roomTypeRoutes);
app.use("/api/v1/room", roomRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/food", foodRoutes);

// connect to database
connectDB();

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(process.env.PORT, () =>
  console.log(
    `Example app listening on port http://localhost:${process.env.PORT}`
  )
);
