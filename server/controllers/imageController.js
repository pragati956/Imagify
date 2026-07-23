import userModel from "../models/userModel.js";
import imageModel from "../models/imageModel.js";
import OpenAI from "openai";
import FormData from "form-data";
import axios from "axios";
import optimizePrompt from "../services/promptService.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const badWordsModule = require("bad-words");

const FilterConstructor = badWordsModule.Filter || badWordsModule.default || badWordsModule;
const customFilter = new FilterConstructor();

customFilter.removeWords("shot", "shoot", "shooting"); // Removed false-positive words from bad-words dictionary

const blockedContentPatterns = [
    /\b(graphic\s+violence|violent\s+scene|explicit\s+violence)\b/i,
    /\b(blood|bloody|bloodbath|bloodshed|blood splatter|splatter)\b/i,
    /\b(gore|gory|gorey|gruesome|graphic\s+gore)\b/i,
    /\b(weapon|weapons|knife|knives|gun|guns|pistol|rifle|bullet|bullets|blade|sword|axe|bomb|explosive|grenade)\b/i,
    /\b(kill|killed|killing|murder|murdered|stab|stabbed|stabbing|slash|slashed|slashing)\b/i,
    /\b(gunshot|gunfire|shootout)\b/i, 
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
        const file = req.file;

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

    const enhancedPrompt = await optimizePrompt(prompt, file);

    res.json({
      success: true,
      enhancedPrompt,
    });

  } catch (error) {
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
        const file = req.file; 
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

        const clipdropApiKey = process.env.CLIPDROP_ID;

        if (!clipdropApiKey) {
            return res.json({
                success: false,
                message: "Missing Clipdrop API key for image generation.",
            });
        }
const finalPrompt = prompt;

        const formData = new FormData();
        formData.append("prompt", finalPrompt);

        const apiUrl = "https://clipdrop-api.co/text-to-image/v1"; // Fixed API URL to a valid Clipdrop endpoint

        const requestHeaders = {
            'x-api-key': clipdropApiKey,
            ...formData.getHeaders()
        };

        const response = await axios.post(apiUrl, formData, {
            headers: requestHeaders,
            responseType: 'arraybuffer'
        });

        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Image}`;

        await imageModel.create({
            userId,
            prompt: finalPrompt,
            image: resultImage
        });

        await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 });

        res.json({
            success: true,
            message: "Image Generated",
            creditBalance: user.creditBalance - 1,
            resultImage,
            originalPrompt: finalPrompt 
        });

    } catch (error) {
        if (error.response?.data) {
            const errText = Buffer.from(error.response.data).toString('utf-8');
            return res.json({ success: false, message: `Clipdrop error: ${errText}` });
        }
        res.json({ success: false, message: error.message });
    }
}

const getUserCreations = async (req, res) => {
    try {
        const userId = String(req.userId); 
        const { search } = req.query;

        let query = { userId };

        if (search) {
            query.prompt = { $regex: search, $options: "i" }; 
        }

        const images = await imageModel.find(query).sort({ createdAt: -1 });
        res.json({ success: true, images });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const deleteCreation = async (req, res) => {
    try {
        const userId = String(req.userId); 
        const { imageId } = req.params;

        const image = await imageModel.findById(imageId);

        if (!image) {
            return res.json({ success: false, message: "Image not found" });
        }

        if (image.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        await imageModel.findByIdAndDelete(imageId);
        res.json({ success: true, message: "Image deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { enhancePrompt, generateImage, getUserCreations, deleteCreation };