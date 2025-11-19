import { useEffect, useState } from "react";
import UserCard from "../../components/UserCard";
import { fetchFreelancers } from "../../api/jobs";

const ClientHome = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchFreelancers();
        setFreelancers(data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load freelancers");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <p>Loading freelancers...</p>;
  }

  return (
    <div className="page">
      <h2>Discover Freelancers</h2>
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {freelancers.map((freelancer) => (
          <UserCard key={freelancer._id} user={freelancer} />
        ))}
        {!freelancers.length && <p>No freelancers found yet.</p>}
      </div>
    </div>
  );
};

export default ClientHome;

