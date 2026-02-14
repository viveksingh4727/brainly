import express from "express";
import { authMiddleware } from "../middleware";
import { shareBrainController, sharedLinkController } from "../controllers/LinkController";


const linkRouter = express.Router();

linkRouter.get("/brainly/share", (req, res) => {
  res.send("Route exists");
});


linkRouter.post("/brainly/share", authMiddleware, shareBrainController);

linkRouter.get("/brainly/:shareLink", sharedLinkController);

export default linkRouter;