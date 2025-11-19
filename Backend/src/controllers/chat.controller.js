import Job from "../models/Job.js";

export const listChats = async (req, res) => {
  try {
    const activeStates = ["assigned", "awaiting-client"];
    const query =
      req.user.role === "client"
        ? { client: req.user._id, status: { $in: activeStates } }
        : { assignedFreelancer: req.user._id, status: { $in: activeStates } };

    const chats = await Job.find(query)
      .sort({ updatedAt: -1 })
      .populate("assignedFreelancer", "fullname username profilePic")
      .populate("client", "fullname username profilePic");

    res.status(200).json(chats);
  } catch (error) {
    console.error("listChats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

