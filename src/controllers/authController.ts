import { AuthRequest } from "../middleware";
import { Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User";
import { signUpSchema, loginSchema } from "../utils/validatinScehma";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET) {
    throw new Error("JWT key is not defined");
}


//Route 1 : signup logic
export const signupController = async(req: AuthRequest, res: Response) => {
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
      } catch(error) {
        return res.status(500).json({ error: "Internal server error" });
      }
};


//Route 2: Login logic
export const loginController = async (req: AuthRequest, res: Response) => {
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
      } catch(error) {
        return res.status(500).json({ error: "Internal server error" });
      }
}
