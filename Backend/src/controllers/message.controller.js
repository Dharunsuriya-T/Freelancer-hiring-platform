import Message from "../models/Message.js";
import Job from "../models/Job.js";

const ensureJobAccess = async (jobId, userId) => {
  const job = await Job.findById(jobId);
  if (!job) return null;

  const allowed =
    String(job.client) === String(userId) ||
    (job.assignedFreelancer && String(job.assignedFreelancer) === String(userId));

  return allowed ? job : null;
};

export const getJobMessages = async (req, res) => {
  try {
    const job = await ensureJobAccess(req.params.jobId, req.user._id);
    if (!job) return res.status(403).json({ message: "You do not have access to this chat." });

    const messages = await Message.find({ job: job._id })
      .sort({ createdAt: 1 })
      .populate("sender", "fullname username profilePic role");
    res.status(200).json(messages);
  } catch (error) {
    console.error("getJobMessages error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postMessage = async (req, res) => {
  try {
    const job = await ensureJobAccess(req.params.jobId, req.user._id);
    if (!job) return res.status(403).json({ message: "You do not have access to this chat." });

    if (!req.body.content || !req.body.content.trim()) {
      return res.status(400).json({ message: "Message content is required." });
    }

    const message = await Message.create({
      job: job._id,
      sender: req.user._id,
      content: req.body.content.trim(),
    });

    const populated = await message.populate("sender", "fullname username profilePic role");

    res.status(201).json(populated);
  } catch (error) {
    console.error("postMessage error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });
    if (String(message.sender) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only delete your own messages." });
    }
    await message.deleteOne();
    res.status(200).json({ message: "Message removed" });
  } catch (error) {
    console.error("deleteMessage error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
