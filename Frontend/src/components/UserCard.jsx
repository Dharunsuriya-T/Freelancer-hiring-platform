const UserCard = ({ user, actions }) => {
  return (
    <article className="card user-card">
      <div className="user-card__avatar">
        <img src={user.profilePic || "https://placehold.co/80"} alt={user.fullname} />
      </div>
      <div className="user-card__details">
        <h3>{user.fullname}</h3>
        <p>@{user.username}</p>
        <p className="muted">{user.specialization || "No specialization set"}</p>
        {user.portfolioLink && (
          <a href={user.portfolioLink} target="_blank" rel="noreferrer">
            View portfolio
          </a>
        )}
        <p className="muted">Completed projects: {user.completedProjects ?? 0}</p>
      </div>
      {actions && <div className="card__actions">{actions}</div>}
    </article>
  );
};

export default UserCard;

