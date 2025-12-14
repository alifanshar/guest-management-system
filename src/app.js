import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";
import guestRoutes from "./routes/guest.routes.js";
import { logger } from "./middleware/logger.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// CHECK SERVER
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Guest Management System API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/guests", guestRoutes);

// ERROR HANDLER
app.use(errorHandler);

export default app;
