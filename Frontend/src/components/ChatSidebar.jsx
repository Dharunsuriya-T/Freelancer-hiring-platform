import { Link, useParams } from "react-router-dom";

const ChatSidebar = ({ chats = [], basePath }) => {
  const { jobId } = useParams();

  if (!chats.length) {
    return (
      <aside className="chat-sidebar">
        <p className="muted">No chats yet.</p>
      </aside>
    );
  }

  return (
    <aside className="chat-sidebar">
      <h4>Projects</h4>
      <ul>
        {chats.map((chat) => (
          <li key={chat._id} className={jobId === chat._id ? "active" : ""}>
            <Link to={`${basePath}/${chat._id}`}>
              <span>{chat.title}</span>
              <small className={`status status--${chat.status}`}>{chat.status}</small>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ChatSidebar;

