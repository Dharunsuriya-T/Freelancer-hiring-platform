import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import JobCard from "../../components/JobCard";
import { acceptApplicant, getApplicants, getClientJobs } from "../../api/jobs";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadJobs = async () => {
    try {
      const { data } = await getClientJobs();
      setJobs(data);
    } catch {
      setError("Unable to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const toggleApplicants = async (jobId) => {
    setSelectedJob((prev) => (prev === jobId ? null : jobId));
    if (!applicants[jobId]) {
      const { data } = await getApplicants(jobId);
      setApplicants((prev) => ({ ...prev, [jobId]: data }));
    }
  };

  const handleAccept = async (jobId, applicationId) => {
    try {
      setError("");
      await acceptApplicant(jobId, { applicationId });
      setNotice("Freelancer accepted! Chat unlocked.");
      await loadJobs();
      const { data } = await getApplicants(jobId);
      setApplicants((prev) => ({ ...prev, [jobId]: data }));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to accept freelancer");
    }
  };

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div className="page">
      <h2>My Jobs</h2>
      {error && <p className="error">{error}</p>}
      {notice && <p className="success">{notice}</p>}
      {jobs.map((job) => (
        <div key={job._id}>
          <JobCard job={job}>
            <div className="job-card__actions">
              <button className="btn btn--ghost" onClick={() => toggleApplicants(job._id)}>
                {selectedJob === job._id ? "Hide applicants" : "View applicants"}
              </button>
              {job.status !== "open" && job.status !== "completed" && (
                <Link className="btn" to={`/client/chat/${job._id}`}>
                  Open chat
                </Link>
              )}
            </div>
          </JobCard>
          {selectedJob === job._id && (
            <div className="card applicants-card">
              <h4>Applicants</h4>
              {applicants[job._id]?.length ? (
                applicants[job._id].map((application) => (
                  <div key={application._id} className="applicant">
                    <div>
                      <p>{application.freelancer.fullname}</p>
                      <p className="muted">{application.proposal || "No proposal"}</p>
                    </div>
                    {job.status === "open" ? (
                      <button className="btn" onClick={() => handleAccept(job._id, application._id)}>
                        Accept
                      </button>
                    ) : (
                      <span className="status status--info">{application.status}</span>
                    )}
                  </div>
                ))
              ) : (
                <p>No applicants yet.</p>
              )}
            </div>
          )}
        </div>
      ))}
      {!jobs.length && <p>You have not posted any jobs yet.</p>}
    </div>
  );
};

export default MyJobs;

