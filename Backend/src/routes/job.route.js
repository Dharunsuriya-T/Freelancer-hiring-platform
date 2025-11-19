import express from "express";
import {
  createJob,
  listOpenJobs,
  getClientJobs,
  getFreelancerProjects,
  getJobById,
  assignFreelancer,
  markAwaitingClient,
  completeJob,
} from "../controllers/job.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createJob);
router.get("/open", protectRoute, listOpenJobs);
router.get("/client", protectRoute, getClientJobs);
router.get("/freelancer", protectRoute, getFreelancerProjects);
router.get("/:jobId", protectRoute, getJobById);
router.patch("/:jobId/assign", protectRoute, assignFreelancer);
router.patch("/:jobId/awaiting", protectRoute, markAwaitingClient);
router.patch("/:jobId/complete", protectRoute, completeJob);

export default router;
