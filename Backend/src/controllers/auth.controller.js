import { generateToken } from "../lib/utlis.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { fullname, username, email, password, role, specialization, portfolio } = req.body;

    try {
        if (!fullname || !username || !email || !password || !role) {
            return res.status(400).json({ message: "Fill all the fields" });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            const field = existingUser.username === username ? "Username" : "Email";
            return res.status(400).json({ message: `${field} already exists, choose a different one.` });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword,
            role,
            specialization: role === "freelancer" ? specialization : "",
            portfolio: role === "freelancer" ? portfolio : "",
        });

        generateToken(newUser._id, res);
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullname,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            profilePic: newUser.profilePic,
            specialization: newUser.specialization,
            portfolio: newUser.portfolio,
            rating: newUser.rating,
        });

    } catch (error) {
        console.log("Error in signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            specialization: user.specialization,
            portfolio: user.portfolio,
            rating: user.rating,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (_,res)=> {
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:"Logged out successfully"})
}
