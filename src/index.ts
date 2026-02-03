import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import mongoose from "mongoose";

import { connectDB } from "./db";
import { UserModel } from "./models/User";
import { ContentModel } from "./models/Content";
import { authMiddleware, AuthRequest } from "./middleware";

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

/* ---------------- ZOD SCHEMAS ---------------- */

const signUpSchema = z.object({
  username: z.string().min(3).max(10),
  password: z.string().min(8).max(20),
});

const loginSchema = z.object({
  username: z.string().min(3).max(10),
  password: z.string().min(8).max(20),
});

const contentSchema = z.object({
  title: z.string(),
  link: z.string().url(),
});

/* ---------------- AUTH ROUTES ---------------- */

app.post("/api/v1/signup", async (req: Request, res: Response) => {
  try {
    const parsed = signUpSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const { username, password } = parsed.data;

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      username,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "User signed up successfully" });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/v1/login", async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const { username, password } = parsed.data;
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
});

/* ---------------- CONTENT ROUTES ---------------- */

app.post(
  "/api/v1/content",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const parsed = contentSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid input" });
      }

      const { title, link } = parsed.data;

      await ContentModel.create({
        title,
        link,
        userId: new mongoose.Types.ObjectId(req.userId),
        tags: [],
      });

      return res.status(201).json({ message: "Content created" });
    } catch {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.get(
  "/api/v1/content",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const content = await ContentModel.find({
      userId: new mongoose.Types.ObjectId(req.userId),
    });

    return res.json({ content });
  }
);

app.delete(
  "/api/v1/content/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deleted = await ContentModel.findByIdAndDelete({
      _id: req.params.id,
      userId: new mongoose.Types.ObjectId(req.userId),
    });

    if (!deleted) {
      return res.status(404).json({ message: "Content not found" });
    }

    return res.json({ message: "Content deleted" });
  }
);

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
