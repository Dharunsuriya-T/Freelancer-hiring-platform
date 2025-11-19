import mongoose from "mongoose";

/**
 * Job Schema
 * ----------
 * A job moves through the following states:
 * open -> assigned -> awaiting-client -> completed
 */
const jobSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    specializationRequired: {
      type: String,
      required: true,
      trim: true,
    },
    budget: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["open", "assigned", "awaiting-client", "completed"],
      default: "open",
    },
    assignedFreelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    acceptedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
