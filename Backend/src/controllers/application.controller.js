import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const applyForJob = async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Only freelancers can apply to jobs." });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.status !== "open") return res.status(400).json({ message: "Job is no longer open for applications." });

    const existingApplication = await Application.findOne({ job: job._id, freelancer: req.user._id });
    if (existingApplication) {
      return res.status(400).json({ message: "You already applied to this job." });
    }

    const application = await Application.create({
      job: job._id,
      freelancer: req.user._id,
      proposal: req.body.proposal ?? "",
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("applyForJob error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const listApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (String(job.client) !== String(req.user._id)) {
      return res.status(403).json({ message: "You cannot view applicants for this job." });
    }

    const applicants = await Application.find({ job: job._id })
      .sort({ createdAt: -1 })
      .populate("freelancer", "fullname username profilePic specialization portfolioLink completedProjects");

    res.status(200).json(applicants);
  } catch (error) {
    console.error("listApplicants error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};