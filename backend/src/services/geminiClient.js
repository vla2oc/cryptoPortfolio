import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";


dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.warn("[Gemini] GEMINI_API_KEY is not set. Requests will fail.");
}


const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function askGemini(prompt) {
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing");
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });


    return response.text;
}
