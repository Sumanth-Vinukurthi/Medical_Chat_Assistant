import React, { useState, useRef, useEffect } from "react";
import "./ChatBotPage.css";
import axios from "axios";
import { useLocation } from "react-router-dom";

function ChatBotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  // upload fields
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const messagesEndRef = useRef(null);

  const location = useLocation();
  const role = location.state?.role;
  console.log("User role:", role);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);

    try {

      const reply = await axios.post( "http://127.0.0.1:7000/chat", { query : input });
      setInput("");
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: reply.data },
        ]);
      }, 600);
      
    } catch (error) {

      console.log(error);
      setMessages((prev) => [
          ...prev,
          { role: "bot", text: "Error contacting server" },
        ]);
    };
    
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUpload = async () => {
    if (!title || !file) {
      alert("Please fill all fields");
      return;
    };

    const formData = new FormData();

    formData.append("title",title);
    formData.append("file",file);

    try{

        const response = await axios.post("http://127.0.0.1:7000/chat/file", formData);
        
        alert(response.data);

    }catch(error){

      alert("Failed to upload document !");

    }

    

    console.log("Uploaded Title:", title);
    console.log("Uploaded File:", file);

    setShowUpload(false);
    setTitle("");
    setFile(null);
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-title">Medical Chat Assistant</div>

      {/* CHAT WINDOW */}
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`msg-bubble ${
              msg.role === "user" ? "user-bubble" : "bot-bubble"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR */}
      <div className="input-bar">

        {role === "Admin" && (
          <div className="pin-icon" onClick={() => setShowUpload(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.44 11.05l-8.49 8.49a5.5 5.5 0 01-7.78-7.78l8.49-8.49a3.5 3.5 0 114.95 4.95l-8.49 8.49a1.5 1.5 0 01-2.12-2.12l8.13-8.13" />
          </svg>
        </div>
        )}

        <input
          type="text"
          className="text-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button className="send-btn" onClick={sendMessage}>
          ➤
        </button>

      </div>


      {/* UPLOAD MODAL */}
      {showUpload && (
        <div className="upload-modal-bg">
          <div className="upload-modal">
            <h3>Upload Document</h3>

            <div className="upload-input-group">
              <label>Title</label>
              <input
                type="text"
                placeholder="Enter document title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="upload-input-group">
              <label>Choose File</label>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              {file && <p className="file-name">📄 {file.name}</p>}
            </div>

            <div className="upload-buttons">
              <button className="cancel-btn" onClick={() => setShowUpload(false)}>
                Cancel
              </button>
              <button className="upload-btn" onClick={handleUpload}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBotPage;