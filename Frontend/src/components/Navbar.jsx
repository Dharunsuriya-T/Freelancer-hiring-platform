import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const links =
    user?.role === "client"
      ? [
          { to: "/client/home", label: "Home" },
          { to: "/client/post-job", label: "Post Job" },
          { to: "/client/my-jobs", label: "My Jobs" },
        ]
      : [
          { to: "/freelancer/home", label: "Open Jobs" },
          { to: "/freelancer/projects", label: "My Projects" },
          { to: "/freelancer/account", label: "Account" },
        ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo">Freelancer Hub</span>
        {user && <span className="navbar__role">{user.role}</span>}
      </div>
      {user && (
        <nav className="navbar__links">
          {links.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
      {user && (
        <button className="btn btn--ghost" onClick={handleLogout}>
          Logout
        </button>
      )}
    </header>
  );
};

export default Navbar;

