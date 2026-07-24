import express from "express";
import multer from "multer"; // Added for image upload
import {
  enhancePrompt,
  generateImage, getUserCreations, deleteCreation, getRoomCreations,
} from "../controllers/imageController.js";

import userAuth from "../middleware/auth.js";

const imageRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Configured multer memory storage

// AI Prompt Optimizer
imageRouter.post(
  "/enhance-prompt",
  userAuth,
  upload.single("referenceImage"), // Added multer middleware to parse the file
  enhancePrompt
);

// Generate Image
imageRouter.post(
  "/generate-image",
  userAuth,
  upload.single("referenceImage"),
  generateImage
);

imageRouter.get('/creations', userAuth, getUserCreations); // New
imageRouter.delete('/creations/:imageId', userAuth, deleteCreation); // New
imageRouter.get('/room-creations/:roomId', userAuth, getRoomCreations);

export default imageRouter;