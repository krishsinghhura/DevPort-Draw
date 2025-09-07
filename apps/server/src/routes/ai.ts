import { Router } from "express";
import { middleware } from "..//middleware";
import { generateDiagram } from "../controllers/aiController";

export const aiRouter = Router();

aiRouter.post("/generate-diagram", middleware, generateDiagram);
