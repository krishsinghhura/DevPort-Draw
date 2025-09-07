import { Router } from "express";
import { middleware } from "../middleware";
import { getDashboard } from "../controllers/dashboardController";

export const dashboardRouter = Router();

dashboardRouter.get("/dashboard", middleware, getDashboard);
