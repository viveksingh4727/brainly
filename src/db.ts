import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log("Db connected");
    } catch (error) {
        console.error("Mongo DB connection failed!", error);
        process.exit(1);
    }
}

mongoose.connect(process.env.MONGO_URL as string);