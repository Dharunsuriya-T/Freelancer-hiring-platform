import { useState } from "react";
import { createJob } from "../../api/jobs";

const PostJob = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    specializationRequired: "",
    budget: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    try {
      await createJob({ ...form, budget: form.budget ? Number(form.budget) : undefined });
      setStatus({ type: "success", message: "Job posted successfully!" });
      setForm({ title: "", description: "", specializationRequired: "", budget: "" });
    } catch (error) {
      setStatus({ type: "error", message: error.response?.data?.message || "Unable to post job" });
    }
  };

  return (
    <div className="page">
      <h2>Post a job</h2>
      <form className="card form-card" onSubmit={handleSubmit}>
        {status.message && <p className={status.type === "error" ? "error" : "success"}>{status.message}</p>}
        <label>
          Title
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </label>
        <label>
          Specialization required
          <input name="specializationRequired" value={form.specializationRequired} onChange={handleChange} required />
        </label>
        <label>
          Budget (optional)
          <input name="budget" value={form.budget} onChange={handleChange} type="number" min="0" />
        </label>
        <button className="btn">Post job</button>
      </form>
    </div>
  );
};

export default PostJob;

