import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatSidebar from "../../components/ChatSidebar";
import ChatWindow from "../../components/ChatWindow";
import { getChats, getJobById, markAwaiting } from "../../api/jobs";
import { useJobChat } from "../../hooks/useJobChat";
import { useAuth } from "../../hooks/useAuth";

const FreelancerChat = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { messages, sendMessage, typingUser, emitTyping } = useJobChat(jobId);
  const [chats, setChats] = useState([]);
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: chatsData }, { data: jobData }] = await Promise.all([getChats(), getJobById(jobId)]);
        setChats(chatsData);
        setJob(jobData);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load chat");
      }
    };
    if (jobId) load();
  }, [jobId]);

  const handleMark = async () => {
    try {
      await markAwaiting(jobId);
      navigate("/freelancer/projects");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update project status");
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!job) return <p>Loading chat...</p>;

  return (
    <div className="chat-page">
      <ChatSidebar chats={chats} basePath="/freelancer/chat" />
      <div className="chat-content">
        <header className="chat-header">
          <div>
            <h2>{job.title}</h2>
            <p className="muted">{job.client?.fullname}</p>
          </div>
          {job.status === "assigned" && (
            <button className="btn btn--ghost" onClick={handleMark}>
              Mark as Completed
            </button>
          )}
        </header>
        <ChatWindow messages={messages} onSend={sendMessage} currentUser={user} typingUser={typingUser} onTyping={emitTyping} />
      </div>
    </div>
  );
};

export default FreelancerChat;

