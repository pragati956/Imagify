import express from "express";
import {
  enhancePrompt,
  generateImage,
} from "../controllers/imageController.js";

import userAuth from "../middleware/auth.js";

const imageRouter = express.Router();

// AI Prompt Optimizer
imageRouter.post(
  "/enhance-prompt",
  userAuth,
  enhancePrompt
);

// Generate Image
imageRouter.post(
  "/generate-image",
  userAuth,
  generateImage
);

export default imageRouter;