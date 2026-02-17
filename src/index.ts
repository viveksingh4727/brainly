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
  origin: "http://localhost:5173", 
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

connectDB();


app.use("/api/v1", userRouter);
app.use("/api/v1", contentRouter);
app.use("/api/v1", linkRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
