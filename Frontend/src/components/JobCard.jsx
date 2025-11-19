const JobCard = ({ job, children }) => {
  return (
    <article className="card job-card">
      <div>
        <h3>{job.title}</h3>
        <p className="muted">{job.description}</p>
        <div className="job-card__meta">
          <span>Specialization: {job.specializationRequired}</span>
          {job.budget && <span>Budget: ${job.budget}</span>}
          {job.client?.fullname && <span>Client: {job.client.fullname}</span>}
          <span className={`status status--${job.status}`}>{job.status}</span>
        </div>
      </div>
      {children && <div className="card__actions">{children}</div>}
    </article>
  );
};

export default JobCard;

