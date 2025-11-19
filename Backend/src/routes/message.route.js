import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { postMessage, getJobMessages, deleteMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:jobId", protectRoute, getJobMessages);
router.post("/:jobId", protectRoute, postMessage);
router.delete("/:messageId", protectRoute, deleteMessage);

export default router;
