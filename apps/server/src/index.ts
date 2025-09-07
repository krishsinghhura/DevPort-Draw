import express from "express";
import { corsOptions } from "./config/cors";
import { authRouter } from "./routes/auth";
import roomRouter  from "./routes/room";
import { dashboardRouter } from "./routes/dashboard";
import { aiRouter } from "./routes/ai";

const app = express();

app.use(express.json());
app.use(corsOptions);

// Register routes
app.use(authRouter);
app.use(roomRouter);
app.use(dashboardRouter);
app.use(aiRouter);

app.listen(3001, () => {
  console.log("✅ HTTP server running on :3001");
});
