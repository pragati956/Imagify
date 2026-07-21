import userModel from "../models/userModel.js";
import imageModel from "../models/imageModel.js";
import OpenAI from "openai";
import FormData from "form-data";
import axios from "axios";
import optimizePrompt from "../services/promptService.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const badWordsModule = require("bad-words");

// Dynamically extract the constructor whether it's nested or direct
const FilterConstructor = badWordsModule.Filter || badWordsModule.default || badWordsModule;
const customFilter = new FilterConstructor();

const blockedContentPatterns = [
    /\b(graphic\s+violence|violent\s+scene|explicit\s+violence)\b/i,
    /\b(blood|bloody|bloodbath|bloodshed|blood splatter|splatter)\b/i,
    /\b(gore|gory|gorey|gruesome|graphic\s+gore)\b/i,
    /\b(weapon|weapons|knife|knives|gun|guns|pistol|rifle|bullet|bullets|blade|sword|axe|bomb|explosive|grenade)\b/i,
    /\b(kill|killed|killing|murder|murdered|stab|stabbed|stabbing|slash|slashed|slashing)\b/i,
    /\b(shoot|shot|shooting|gunshot|gunfire|shootout)\b/i,
    /\b(behead|beheaded|decapitat|dismember|disembowel|maim|mutilat|tortur|strangle|choke\s+to\s+death|beat\s+to\s+death)\b/i,
    /\b(assault|attack|attacked|attacking|slaughter|massacre|execution|corpse|cadaver|wound|wounded|injur|maimed|bloodstained)\b/i,
    /\b(war|warfare|battle|battlefield|combat|fight|fighting|terror|terrorist|hostage)\b/i,
];

const isRestrictedPrompt = (prompt) => {
    if (!prompt) {
        return false;
    }

    if (customFilter.isProfane(prompt)) {
        return true;
    }

    return blockedContentPatterns.some((pattern) => pattern.test(prompt));
};

const enhancePrompt = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.json({
        success: false,
        message: "Prompt is required",
      });
    }

        if (isRestrictedPrompt(prompt)) {
      return res.json({
        success: false,
                message: "Restricted language detected. Please remove profanity, violence, blood, or gore from the prompt.",
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
        const file = req.file; // Extracted uploaded file
        const user = await userModel.findById(userId);

        if (!user || !prompt) {
            return res.json({ success: false, message: "Missing Details" });
        }

        if (isRestrictedPrompt(prompt)) {
            return res.json({
                success: false,
                message: "Restricted language detected in prompt. Image cannot be generated."
            });
        }

        if (user.creditBalance === 0) {
            return res.json({ success: false, message: "No Credit Balance", creditBalance: user.creditBalance });
        }

        // Prepare FormData for Clipdrop
        const formData = new FormData();
        formData.append("prompt", prompt);

        let apiUrl = "https://clipdrop-api.co/text-to-image/v1"; // Extracted URL to variable

        if (file) { // Handled file upload for Image-to-Image style reference
            apiUrl = "https://clipdrop-api.co/reimagine/v1"; 
            formData.append("image_file", file.buffer, {
                filename: file.originalname,
                contentType: file.mimetype,
            });
        }

        // Call Clipdrop API
        const response = await axios.post(apiUrl, formData, { // Replaced static URL with dynamic apiUrl
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
}

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