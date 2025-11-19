
import express from "express";
import dotenv from "dotenv";
import path from "path";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import jobRoutes from "./routes/job.route.js";
import applicationRoutes from "./routes/application.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDB } from "./lib/db.js";
import { initSocket } from "./lib/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const rootDir = path.resolve();
const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chats", chatRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(rootDir, "..", "Frontend", "dist");
  app.use(express.static(frontendPath));
  app.get("*", (_, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

connectDB()
  .then(() => {
    initSocket(server);
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });
