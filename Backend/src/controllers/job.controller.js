import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const createJob = async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can post jobs." });
    }

    const { title, description, specializationRequired, budget } = req.body;

    if (!title || !description || !specializationRequired) {
      return res.status(400).json({ message: "Title, description and specialization are required." });
    }

    const parsedBudget =
      budget === undefined || budget === null || budget === ""
        ? null
        : Number(budget);

    const job = await Job.create({
      client: req.user._id,
      title,
      description,
      specializationRequired,
      budget: Number.isNaN(parsedBudget) ? null : parsedBudget,
    });

    res.status(201).json(job);
  } catch (error) {
    console.error("createJob error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const listOpenJobs = async (_req, res) => {
  try {
    const jobs = await Job.find({ status: "open" })
      .sort({ createdAt: -1 })
      .populate("client", "fullname username profilePic");
    res.status(200).json(jobs);
  } catch (error) {
    console.error("listOpenJobs error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getClientJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ client: req.user._id })
      .sort({ createdAt: -1 })
      .populate("assignedFreelancer", "fullname username profilePic specialization");
    res.status(200).json(jobs);
  } catch (error) {
    console.error("getClientJobs error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFreelancerProjects = async (req, res) => {
  try {
    const jobs = await Job.find({
      assignedFreelancer: req.user._id,
      status: { $in: ["assigned", "awaiting-client"] },
    })
      .sort({ updatedAt: -1 })
      .populate("client", "fullname username profilePic");
    res.status(200).json(jobs);
  } catch (error) {
    console.error("getFreelancerProjects error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)
      .populate("client", "fullname username profilePic")
      .populate("assignedFreelancer", "fullname username profilePic specialization");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    console.error("getJobById error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const assignFreelancer = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { applicationId, freelancerId } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (String(job.client) !== String(req.user._id)) {
      return res.status(403).json({ message: "You cannot modify this job." });
    }
    if (job.status !== "open") {
      return res.status(400).json({ message: "Job is no longer open." });
    }

    let application;
    if (applicationId) {
      application = await Application.findById(applicationId);
    } else if (freelancerId) {
      application = await Application.findOne({ job: jobId, freelancer: freelancerId });
    }

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (String(application.job) !== String(jobId)) {
      return res.status(400).json({ message: "Application does not belong to this job." });
    }

    application.status = "accepted";
    await application.save();

    await Application.updateMany({ job: jobId, _id: { $ne: application._id } }, { status: "rejected" });

    job.status = "assigned";
    job.assignedFreelancer = application.freelancer;
    job.acceptedAt = new Date();
    await job.save();

    const populated = await job.populate("assignedFreelancer", "fullname username profilePic specialization");

    res.status(200).json(populated);
  } catch (error) {
    console.error("assignFreelancer error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markAwaitingClient = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (String(job.assignedFreelancer) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (job.status !== "assigned") {
      return res.status(400).json({ message: "Job is not in an assignable state." });
    }

    job.status = "awaiting-client";
    await job.save();
    res.status(200).json(job);
  } catch (error) {
    console.error("markAwaitingClient error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const completeJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (String(job.client) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!["assigned", "awaiting-client"].includes(job.status)) {
      return res.status(400).json({ message: "This job cannot be completed yet." });
    }

    job.status = "completed";
    await job.save();

    if (job.assignedFreelancer) {
      await User.findByIdAndUpdate(job.assignedFreelancer, { $inc: { completedProjects: 1 } });
    }

    await Message.deleteMany({ job: jobId });

    res.status(200).json(job);
  } catch (error) {
    console.error("completeJob error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
