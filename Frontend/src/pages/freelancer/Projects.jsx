import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import JobCard from "../../components/JobCard";
import { getFreelancerJobs, markAwaiting } from "../../api/jobs";

const Projects = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await getFreelancerJobs();
      setJobs(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load projects");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleMark = async (jobId) => {
    try {
      await markAwaiting(jobId);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update project");
    }
  };

  return (
    <div className="page">
      <h2>My Projects</h2>
      {error && <p className="error">{error}</p>}
      {jobs.map((job) => (
        <JobCard key={job._id} job={job}>
          <div className="job-card__actions">
            <Link className="btn" to={`/freelancer/chat/${job._id}`}>
              Open chat
            </Link>
            {job.status === "assigned" && (
              <button className="btn btn--ghost" onClick={() => handleMark(job._id)}>
                Mark as completed
              </button>
            )}
          </div>
        </JobCard>
      ))}
      {!jobs.length && <p>You have no active projects.</p>}
    </div>
  );
};

export default Projects;

