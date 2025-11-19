import mongoose from "mongoose";

/**
 * User Schema
 * ----------
 * Captures both client and freelancer identities with optional profile meta.
 * `completedProjects` is mainly used for freelancers but kept for both roles
 * to keep the analytics simple.
 */
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["client", "freelancer"],
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    specialization: {
      type: String,
      default: "",
    },
    portfolioLink: {
      type: String,
      default: "",
    },
    completedProjects: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, doc) {
        delete doc.password;
        delete doc.__v;
        return doc;
      },
    },
  }
);

const User = mongoose.model("User", userSchema);

export default User;
