import { useEffect, useRef, useState } from "react";

const ChatWindow = ({ messages, onSend, currentUser, disabled, typingUser, onTyping }) => {
  const [value, setValue] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChange = (e) => {
    setValue(e.target.value);
    onTyping?.(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value);
    setValue("");
    onTyping?.(false);
  };

  return (
    <div className="chat-window">
      <div className="chat-window__messages">
        {messages.map((msg) => {
          const mine = msg.sender?._id === currentUser?._id;
          return (
            <div key={msg._id} className={`chat-bubble ${mine ? "me" : ""}`}>
              <p>{msg.content}</p>
              <small>{mine ? "You" : msg.sender?.fullname}</small>
            </div>
          );
        })}
        {typingUser && typingUser !== currentUser?._id && (
          <div className="chat-bubble typing">
            <p>Typing…</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form className="chat-window__input" onSubmit={handleSubmit}>
        <input value={value} onChange={handleChange} onBlur={() => onTyping?.(false)} placeholder="Send a message" disabled={disabled} />
        <button className="btn" type="submit" disabled={disabled}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;

