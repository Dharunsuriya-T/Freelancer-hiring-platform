import User from "../models/User.js";
import { sanitizeUser } from "../lib/utlis.js";

/**
 * Fetch all freelancers with their public profile information.
 */
export const getFreelancers = async (_req, res) => {
  try {
    const freelancers = await User.find({ role: "freelancer" }).select(
      "fullname username profilePic specialization portfolioLink completedProjects"
    );
    res.status(200).json(freelancers);
  } catch (error) {
    console.error("getFreelancers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Generic profile fetch endpoint for currently authenticated user.
 */
export const getCurrentProfile = async (req, res) => {
  res.status(200).json({ user: sanitizeUser(req.user) });
};

