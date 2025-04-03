import { useState } from "react";
import "../assets/css/ChatAppGemini.css";

const ChatAppGemini = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://localhost:9999/api/chatAi/chatGemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: input }]
            }
          ]
        })
      });
      const data = await response.json();
      const botMessage = {
        role: "bot",
        text: data.candidates?.[0]?.content?.parts?.[0]?.text || "Lỗi phản hồi"
      };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Lỗi gửi tin nhắn", error);
    }
  };

  return (
    <div className="chat-container">
      <button className="chat-toggle-btn" onClick={() => setShowChat(!showChat)}>
        {showChat ? "Đóng Chat Ai" : "Mở Chat Ai"}
      </button>
      {showChat && (
        <div className="chat-box">
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="chat-input"
            />
            <button className="send-btn" onClick={sendMessage}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAppGemini;
