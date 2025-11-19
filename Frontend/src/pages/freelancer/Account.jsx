import { useEffect, useState } from "react";
import { fetchMe, updateProfile } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";

const Account = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ profilePic: "", specialization: "", portfolioLink: "" });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const syncProfile = async () => {
      try {
        const { data } = await fetchMe();
        setUser(data.user);
      } catch (error) {
        console.error(error);
      }
    };
    syncProfile();
  }, [setUser]);

  useEffect(() => {
    if (user) {
      setForm({
        profilePic: user.profilePic || "",
        specialization: user.specialization || "",
        portfolioLink: user.portfolioLink || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await updateProfile(form);
      setUser(data.user);
      setMessage({ type: "success", text: "Profile updated" });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Unable to update profile" });
    }
  };

  return (
    <div className="page">
      <h2>Account</h2>
      <p>Completed projects: {user?.completedProjects || 0}</p>
      <form className="card form-card" onSubmit={handleSubmit}>
      {message.text && <p className={message.type === "error" ? "error" : "success"}>{message.text}</p>}
        <label>
          Profile picture URL
          <input name="profilePic" value={form.profilePic} onChange={handleChange} />
        </label>
        <label>
          Specialization
          <input name="specialization" value={form.specialization} onChange={handleChange} />
        </label>
        <label>
          Portfolio link
          <input name="portfolioLink" value={form.portfolioLink} onChange={handleChange} />
        </label>
        <button className="btn">Save changes</button>
      </form>
    </div>
  );
};

export default Account;

