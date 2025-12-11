// client/components/SuogluAIChat.jsx
import React, { useState } from "react";
import robotImage from "../src/assets/SuogluAI-Bot.jpeg";

const SuogluAIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Hi! I'm SuogluAI Assistant. 😊",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/suogluai/chat"
      : "/api/suogluai/chat";

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
        }),
      });

      const data = await res.json();

      if (data?.reply) {
        const botMsg = {
          id: Date.now() + 1,
          role: "assistant",
          content: data.reply,
        };

        setMessages((prev) => [...prev, botMsg]);

        setHistory((prev) => [
          ...prev,
          { role: "user", content: text },
          { role: "assistant", content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            role: "assistant",
            content: "An error occurred. Please try again.",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 3,
          role: "assistant",
          content: "There was a problem connecting to the server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button at bottom-right */}
      <button
        className="suogluai-launcher"
        onClick={() => setIsOpen((p) => !p)}
        aria-label="Open SuogluAI chat"
      >
        <span className="suogluai-launcher-icon">💬</span>
      </button>

      {isOpen && (
        <div className="suogluai-chat">
          <div className="suogluai-chat-header">
            <div className="suogluai-header-left">
              <img
                src={robotImage}
                alt="SuogluAI robot avatar"
                className="suogluai-robot-icon"
              />
              <div>
                <div className="suogluai-title">SuogluAI Assistant</div>
                <div className="suogluai-subtitle">
                  AI helper for this portfolio
                </div>
              </div>
            </div>
            <button
              className="suogluai-close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="suogluai-messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  "suogluai-message " +
                  (m.role === "user" ? "suogluai-user" : "suogluai-bot")
                }
              >
                <div className="suogluai-message-text">{m.content}</div>
              </div>
            ))}

            {loading && (
              <div className="suogluai-message suogluai-bot">
                <div className="suogluai-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          <form className="suogluai-input-area" onSubmit={handleSend}>
            <input
              type="text"
              className="suogluai-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="suogluai-send-btn"
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default SuogluAIChat;
