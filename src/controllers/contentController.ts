import mongoose from "mongoose";
import { Response } from "express";

import { AuthRequest } from "../middleware";
import { ContentModel } from "../models/Content";
import { contentSchema } from "../utils/validatinScehma";


export const addContentController = async ( req: AuthRequest, res: Response ) => {
    try {
          if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized" });
          }
    
          const parsed = contentSchema.safeParse(req.body);
          if (!parsed.success) {
            return res.status(400).json({ message: "Invalid input" });
          }
    
          const { title, link, types, tag } = parsed.data;
    
          await ContentModel.create({
            title,
            link,
            userId: new mongoose.Types.ObjectId(req.userId),
            types,
            tag: tag ?? null,
          });
    
          return res.status(201).json({ message: "Content created" });
        } catch(error) {
          return res.status(500).json({ error: "Internal server error" });
        }    
};
export const getContentController = async (req: AuthRequest, res: Response ) => {
    if (!req.userId) {
          return res.status(401).json({ message: "Unauthorized" });
        }
    
        const content = await ContentModel.find({
          userId: new mongoose.Types.ObjectId(req.userId),
        }).populate('userId', "username, _id'");
    
        return res.json({ content });
};

export const deleteContentController = async (req: AuthRequest, res: Response ) => {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const contentId = req.params.id;

    const deleted = await ContentModel.deleteMany({
      _id: contentId,
      userId: new mongoose.Types.ObjectId(req.userId),
    });

    if (!deleted) {
      return res.status(404).json({ message: "Content not found" });
    }

    return res.json({ message: "Content deleted" });
}