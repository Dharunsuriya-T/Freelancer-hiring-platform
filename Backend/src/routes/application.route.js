import express from "express";
import { applyForJob, listApplicants } from "../controllers/application.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:jobId", protectRoute, applyForJob);
router.get("/:jobId", protectRoute, listApplicants);

export default router;
