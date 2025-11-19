import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/Message.js";
import Job from "../models/Job.js";

let io;

const verifyJobAccess = async (jobId, userId) => {
  const job = await Job.findById(jobId).select("client assignedFreelancer status");
  if (!job) return null;
  const allowed =
    String(job.client) === String(userId) ||
    (job.assignedFreelancer && String(job.assignedFreelancer) === String(userId));
  return allowed ? job : null;
};

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL?.split(",") || "*",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error("Unauthorized"));
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.userId;
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", async ({ jobId }) => {
      const job = await verifyJobAccess(jobId, socket.userId);
      if (!job) {
        return socket.emit("chat:error", "You cannot join this room.");
      }
      socket.join(`job_${jobId}`);
      socket.emit("chat:joined", `job_${jobId}`);
    });

    socket.on("chat:message", async ({ jobId, content }) => {
      if (!content?.trim()) return;
      const job = await verifyJobAccess(jobId, socket.userId);
      if (!job) return socket.emit("chat:error", "You cannot send messages to this job.");

      const message = await Message.create({
        job: jobId,
        sender: socket.userId,
        content: content.trim(),
      });

      const hydrated = await message.populate("sender", "fullname username profilePic role");
      io.to(`job_${jobId}`).emit("chat:message", hydrated);
    });

    socket.on("typing", async ({ jobId, isTyping }) => {
      const job = await verifyJobAccess(jobId, socket.userId);
      if (!job) return;
      socket.to(`job_${jobId}`).emit("typing", { jobId, userId: socket.userId, isTyping });
    });
  });
};

export { io };
