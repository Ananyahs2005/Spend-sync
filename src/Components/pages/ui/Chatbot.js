import React, { useState, useEffect, useRef } from "react";

const formatBotResponse = (text) => {
  if (!text) return "Sorry, I didn’t understand that.";

  let formattedText = text;
  formattedText = formattedText.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
  formattedText = formattedText.replace(/^- (.*)/gm, "<li>$1</li>");
  if (formattedText.includes("<li>")) formattedText = `<ul>${formattedText}</ul>`;
  formattedText = formattedText.replace(/\n/g, "<br>");
  return formattedText;
};

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I’m SpendSync Bot 💰 How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: window.innerHeight - 600 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    const newMessages = [...messages, { sender: "user", text: userMessage }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      const data = await response.json();
      const botReply = formatBotResponse(data.reply);

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Error connecting to backend. Please check your server (port 5000).",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) handleSend();
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#0078ff",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            fontSize: "24px",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            zIndex: 1000,
          }}
        >
          💬
        </button>
      )}

      {/* Draggable Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            left: position.x,
            top: position.y,
            width: "350px",
            maxHeight: "500px",
            backgroundColor: "#fff",
            borderRadius: "15px",
            boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            cursor: dragging ? "grabbing" : "default",
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              backgroundColor: "#0078ff",
              color: "white",
              padding: "10px 15px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "grab",
              userSelect: "none",
            }}
          >
            SpendSync Bot 🤖
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              backgroundColor: "#f9fbfc",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  margin: "8px 0",
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      msg.sender === "user" ? "#0078ff" : "#e4e6eb",
                    color: msg.sender === "user" ? "white" : "black",
                    padding: "10px 14px",
                    borderRadius: "15px",
                    maxWidth: "75%",
                    textAlign: msg.sender === "user" ? "right" : "left",
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                </div>
              </div>
            ))}

            {loading && (
              <div
                style={{
                  textAlign: "center",
                  color: "#777",
                  fontStyle: "italic",
                  marginTop: "10px",
                }}
              >
                SpendSync Bot is typing...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              padding: "10px",
              borderTop: "1px solid #eee",
              backgroundColor: "white",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              style={{
                marginLeft: "8px",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#0078ff",
                color: "white",
                cursor: "pointer",
                opacity: !input.trim() || loading ? 0.6 : 1,
              }}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
