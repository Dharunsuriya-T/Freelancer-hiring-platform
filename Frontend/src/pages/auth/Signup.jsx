import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    role: "client",
    specialization: "",
    portfolioLink: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user } = await signup(form);
      navigate(`/${user.role}/home`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>Create account</h2>
        {error && <p className="error">{error}</p>}
        <label>
          Full name
          <input name="fullname" value={form.fullname} onChange={handleChange} required />
        </label>
        <label>
          Username
          <input name="username" value={form.username} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          Role
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>
        </label>
        {form.role === "freelancer" && (
          <>
            <label>
              Specialization
              <input name="specialization" value={form.specialization} onChange={handleChange} />
            </label>
            <label>
              Portfolio link
              <input name="portfolioLink" value={form.portfolioLink} onChange={handleChange} />
            </label>
          </>
        )}
        <button className="btn" disabled={loading}>
          {loading ? "Creating..." : "Sign up"}
        </button>
        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;

