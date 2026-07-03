import userModel from "../models/userModel.js";
import imageModel from "../models/imageModel.js";
import OpenAI from "openai";
import FormData from "form-data";
import axios from "axios";
import optimizePrompt from "../services/promptService.js";
const enhancePrompt = async (req, res) => {
  try {

    const { prompt } = req.body;

    if (!prompt) {
      return res.json({
        success: false,
        message: "Prompt is required",
      });
    }

    const enhancedPrompt = await optimizePrompt(prompt);

    res.json({
      success: true,
      enhancedPrompt,
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });

  }
};

const generateImage = async (req, res) => {
    try {
        const userId = String(req.userId);
        const { prompt } = req.body;
        const user = await userModel.findById(userId);

        if (!user || !prompt) {
            return res.json({ success: false, message: "Missing Details" });
        }

        if (user.creditBalance === 0) {
            return res.json({ success: false, message: "No Credit Balance", creditBalance: user.creditBalance });
        }

        // Prepare FormData for Clipdrop
        const formData = new FormData();
        formData.append("prompt", prompt);

        // Call Clipdrop API
        const response = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_ID,
                ...formData.getHeaders()
            },
            responseType: 'arraybuffer' // Get image as binary data
        });

        // Convert binary to Base64
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Image}`;

        // Save to Database
        await imageModel.create({
            userId,
            prompt,
            image: resultImage
        });

        await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 });

        res.json({
            success: true,
            message: "Image Generated",
            creditBalance: user.creditBalance - 1,
            resultImage,
            originalPrompt: prompt
        });

    } catch (error) {
        console.log("Clipdrop Error:", error.response ? error.response.data : error.message);
        res.json({ success: false, message: error.message });
    }
};

// Fetch User Creations with Search
const getUserCreations = async (req, res) => {
    try {
        const userId = String(req.userId);  // Explicitly convert to string
        const { search } = req.query;

        let query = { userId };

        // Search functionality
        if (search) {
            query.prompt = { $regex: search, $options: "i" }; // Case-insensitive search
        }

        // Sort by newest first
        const images = await imageModel.find(query).sort({ createdAt: -1 });
        res.json({ success: true, images });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Delete a Creation manually
const deleteCreation = async (req, res) => {
    try {
        const userId = String(req.userId);  // Explicitly convert to string
        const { imageId } = req.params;

        const image = await imageModel.findById(imageId);

        if (!image) {
            return res.json({ success: false, message: "Image not found" });
        }

        // Ensure the user owns this image before deleting
        if (image.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        await imageModel.findByIdAndDelete(imageId);
        res.json({ success: true, message: "Image deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { enhancePrompt, generateImage, getUserCreations, deleteCreation };