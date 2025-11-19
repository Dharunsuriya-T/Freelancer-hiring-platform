import { generateToken } from "../lib/utlis.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
export const signup=async(req,res)=>{
    const {fullname, username, email, password, role}=req.body
    try {
        if(!fullname || !username || !email || !password || !role ){
            return res.status(400).json({message:"Fill all the fields"})
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            const field = existingUser.username === username ? 'Username' : 'Email';
            return res.status(400).json({ message: `${field} already exists, please choose a different one.` });
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
    });

    if(newUser){
        generateToken(newUser._id, res)
        await newUser.save()

        res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        profilePic: newUser.profilePic,
        })
    } else{
        res.status(400).json({message: "Invalid user data"})
    }


    } catch (error) {
        console.log("Error in signup cont: ",error);
        res.status(500).json({message:"Internal server error"});
    }
}