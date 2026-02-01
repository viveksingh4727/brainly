import express from "express";
import { Request, Response } from "express";
import {z} from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserModel } from "../src/models/User";

dotenv.config();
const app = express();

app.use(express.json());


const signUpSchema = z.object({
    username: z.string().min(3).max(10),
    password: z.string().min(8).max(20),
});

const loginSchema = z.object({
    username: z.string().min(3).max(10),
    password: z.string().min(8).max(20),
})

app.post("/api/v1/signup", async (req : Request, res: Response) => {

  try {
    const parsed = signUpSchema.safeParse(req.body);

    if(!parsed.success) {
      return res.status(400).json({
        message: "Invalid input",
        error: parsed.error.format(),
      });
    }

    const { username, password } = parsed.data;

    const existingUser = await UserModel.findOne({ username });

    if(existingUser) {
      return res.status(403).json({
        message: "User already exists with this username"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      username,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "User signed up succesfully!"
    })
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
  
});

app.post("/api/v1/login", async (req: Request, res: Response) => {
  try {
    const parseData = loginSchema.safeParse(req.body);
    if(!parseData.success) {
      return res.status(400).json({
        message: "Invalid input",
        error: parseData.error.format(),
      });
    }

    const { username, password } = parseData.data;
    const user = await UserModel.findOne({ username });

    if(!user) {
      return res.status(404).json({
        message: "User doesn't exist"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect) {
      return res.status(401).json({
        message: "Incorrect credentials"
      });
    }


    const token = jwt.sign({username: user.username}, 
      process.env.JWT_SECRET as string,
      {expiresIn: "1h"}
    );

    res.status(201).json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server error"
    })
  }
});

app.post("/api/v1/content", (req: Request, res: Response) => {
    
});

app.get("/api/v1/content", (req: Request, res: Response) => {

});

app.delete("/api/v1/content", (req: Request, res: Response) => {

});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

