import express from "express";
import dotenv from "dotenv";
import cors from "cors";


import { connectDB } from "./db";
import userRouter from "./routes/authRoutes";
import contentRouter from "./routes/contentRoutes";
import linkRouter from "./routes/linkRoutes";

dotenv.config();



const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://brainly-frontend-rho.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());


connectDB();


app.use("/api/v1", userRouter);
app.use("/api/v1", contentRouter);
app.use("/api/v1", linkRouter);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
