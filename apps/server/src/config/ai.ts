import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({
  vertexai: false,
  apiKey: process.env.GEMENI_API_KEY,
});
