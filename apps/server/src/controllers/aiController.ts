import { Request, Response } from "express";
import { SYSTEM_PROMPT } from "../utils/systemPromot";
import { redisClient, connectRedis } from "@repo/servers-common/redisClient";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  vertexai: false,
  apiKey: "AIzaSyCzeU__Ojn6MZLd7ke0aAhH2R34VmI95f4",
});

connectRedis();

export async function generateDiagram(req:Request, res:Response)  {
  const { prompt, roomId } = req.body;
  const userId = req.userId; 

  if (!prompt || !roomId || !userId) {
    return res.status(400).json({ error: "prompt, roomId and userId are required" });
  }

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\nUser request: ${prompt}\nRoomId: ${roomId}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json", 
      },
    });

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!text) {
      return res.status(500).json({ error: "AI did not return any JSON" });
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "Invalid JSON returned from AI", raw: text });
    }

    
    if (parsed?.events && Array.isArray(parsed.events)) {
      parsed.events = parsed.events.map((event: any) => ({
        ...event,
        userId, 
      }));
    }

    
    const redisKeyEvents = `room:${roomId}:events`;
    const redisKeyCache = `room:${roomId}:cache`;

    const serializedEvents = parsed.events.map((e: any) => JSON.stringify(e));

    if (serializedEvents.length > 0) {
      await redisClient.rPush(redisKeyEvents, serializedEvents);
      await redisClient.rPush(redisKeyCache, serializedEvents);
      await redisClient.expire(redisKeyCache, 24 * 60 * 60); 
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error("AI generation failed:", error);
    return res.status(500).json({ error: error.message });
  }
}