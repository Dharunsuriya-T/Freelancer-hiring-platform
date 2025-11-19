import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getMessages } from "../api/jobs";

const stripApi = (url) => url.replace(/\/api$/, "");

const socketBase =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.VITE_API_URL ? stripApi(import.meta.env.VITE_API_URL) : "http://localhost:5000");

export const useJobChat = (jobId) => {
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!jobId) return;
    const loadMessages = async () => {
      const { data } = await getMessages(jobId);
      setMessages(data);
    };
    loadMessages();
  }, [jobId]);

  useEffect(() => {
    if (!jobId) return;
    const socket = io(socketBase, {
      auth: { token: localStorage.getItem("freelance_token") },
    });
    socketRef.current = socket;
    socket.emit("joinRoom", { jobId });
    socket.on("chat:message", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    socket.on("typing", ({ userId, isTyping }) => {
      if (!isTyping) {
        setTypingUser(null);
        return;
      }
      setTypingUser(userId);
      setTimeout(() => setTypingUser(null), 1500);
    });
    return () => socket.disconnect();
  }, [jobId]);

  const sendMessage = (content) => {
    socketRef.current?.emit("chat:message", { jobId, content });
  };

  const emitTyping = (isTyping) => {
    socketRef.current?.emit("typing", { jobId, isTyping });
  };

  return { messages, sendMessage, typingUser, emitTyping };
};

