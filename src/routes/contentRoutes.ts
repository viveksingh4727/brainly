import express from "express";
import { authMiddleware } from "../middleware";
import { addContentController, deleteContentController, getContentController } from "../controllers/contentController";

const contentRouter = express.Router();

contentRouter.post("/content", authMiddleware, addContentController);
contentRouter.get("/content", authMiddleware, getContentController);
contentRouter.delete("/content/:id", authMiddleware, deleteContentController);

export default contentRouter;