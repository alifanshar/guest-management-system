import express from "express";

const app = express();

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Guest Management System API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ERROR HANDLER
app.use(errorHandler);

export default app;