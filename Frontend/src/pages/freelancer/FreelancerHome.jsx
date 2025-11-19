import { useEffect, useState } from "react";
import JobCard from "../../components/JobCard";
import { applyToJob, getOpenJobs } from "../../api/jobs";

const FreelancerHome = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [proposal, setProposal] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  const loadJobs = async () => {
    try {
      const { data } = await getOpenJobs();
      setJobs(data);
      setAlert((prev) => (prev.type === "error" ? { type: "", message: "" } : prev));
    } catch (error) {
      setAlert({ type: "error", message: error.response?.data?.message || "Unable to load jobs" });
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleApply = async (jobId) => {
    try {
      await applyToJob(jobId, { proposal });
      setAlert({ type: "success", message: "Applied successfully!" });
      setSelectedJob(null);
      setProposal("");
    } catch (error) {
      setAlert({ type: "error", message: error.response?.data?.message || "Unable to apply" });
    }
  };

  return (
    <div className="page">
      <h2>Open jobs</h2>
      {alert.message && <p className={alert.type === "error" ? "error" : "success"}>{alert.message}</p>}
      {jobs.map((job) => (
        <div key={job._id}>
          <JobCard job={job}>
            <button
              className="btn"
              onClick={() => {
                const isSame = job._id === selectedJob;
                setSelectedJob(isSame ? null : job._id);
                setProposal("");
              }}
            >
              {selectedJob === job._id ? "Cancel" : "Apply"}
            </button>
          </JobCard>
          {selectedJob === job._id && (
            <div className="card form-card">
              <label>
                Proposal (optional)
                <textarea value={proposal} onChange={(e) => setProposal(e.target.value)} />
              </label>
              <button className="btn" onClick={() => handleApply(job._id)}>
                Submit application
              </button>
            </div>
          )}
        </div>
      ))}
      {!jobs.length && <p>No open jobs right now.</p>}
    </div>
  );
};

export default FreelancerHome;
