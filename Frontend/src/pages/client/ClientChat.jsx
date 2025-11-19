import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatSidebar from "../../components/ChatSidebar";
import ChatWindow from "../../components/ChatWindow";
import { completeJob, getChats, getJobById } from "../../api/jobs";
import { useJobChat } from "../../hooks/useJobChat";
import { useAuth } from "../../hooks/useAuth";

const ClientChat = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { messages, sendMessage, typingUser, emitTyping } = useJobChat(jobId);
  const [chats, setChats] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: chatsData }, { data: jobData }] = await Promise.all([getChats(), getJobById(jobId)]);
        setChats(chatsData);
        setJob(jobData);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load chat");
      } finally {
        setLoading(false);
      }
    };
    if (jobId) load();
  }, [jobId]);

  const handleFinish = async () => {
    try {
      await completeJob(jobId);
      navigate("/client/my-jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to finish project");
    }
  };

  if (loading) return <p>Loading chat...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div className="chat-page">
      <ChatSidebar chats={chats} basePath="/client/chat" />
      <div className="chat-content">
        <header className="chat-header">
          <div>
            <h2>{job.title}</h2>
            <p className="muted">{job.assignedFreelancer?.fullname || "No freelancer yet"}</p>
          </div>
          {job.status !== "completed" && (
            <button className="btn btn--danger" onClick={handleFinish}>
              Finish Project
            </button>
          )}
        </header>
        <ChatWindow messages={messages} onSend={sendMessage} currentUser={user} typingUser={typingUser} onTyping={emitTyping} />
      </div>
    </div>
  );
};

export default ClientChat;

