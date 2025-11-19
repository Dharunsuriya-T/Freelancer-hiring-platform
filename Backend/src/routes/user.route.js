import express from "express";
import { getFreelancers, getCurrentProfile } from "../controllers/users.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/freelancers", protectRoute, getFreelancers);
router.get("/me", protectRoute, getCurrentProfile);

export default router;

