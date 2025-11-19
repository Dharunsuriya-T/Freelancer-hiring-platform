import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken, sanitizeUser } from "../lib/utlis.js";

/**
 * Sign up controller
 */
export const signup = async (req, res) => {
  const { fullname, username, email, password, role, specialization, portfolioLink } = req.body;

  try {
    if (!fullname || !username || !email || !password || !role) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    if (!["client", "freelancer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role selected." });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] }).lean();
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
      role,
      specialization: role === "freelancer" ? specialization : "",
      portfolioLink: role === "freelancer" ? portfolioLink : "",
    });

    const token = generateToken(user._id, res);

    return res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Login controller
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, res);
    return res.status(200).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  return res.status(200).json({ message: "Logged out successfully" });
};

export const me = async (req, res) => {
  return res.status(200).json({ user: sanitizeUser(req.user) });
};

export const updateProfile = async (req, res) => {
  const { fullname, profilePic, specialization, portfolioLink } = req.body;
  try {
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(fullname && { fullname }),
        ...(profilePic !== undefined && { profilePic }),
        ...(specialization !== undefined && { specialization }),
        ...(portfolioLink !== undefined && { portfolioLink }),
      },
      { new: true }
    );

    return res.status(200).json({ user: sanitizeUser(updated) });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
