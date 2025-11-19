import express from "express";
import { logout, signup, login, updateProfile, me } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, me);
router.put("/profile", protectRoute, updateProfile);

export default router;