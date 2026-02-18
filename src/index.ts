import express from "express";
import dotenv from "dotenv";
import cors from "cors";


import { connectDB } from "./db";
import userRouter from "./routes/authRoutes";
import contentRouter from "./routes/contentRoutes";
import linkRouter from "./routes/linkRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*", 
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

connectDB();


app.use("/api/v1", userRouter);
app.use("/api/v1", contentRouter);
app.use("/api/v1", linkRouter);

const PORT = process.env.PORT || 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
