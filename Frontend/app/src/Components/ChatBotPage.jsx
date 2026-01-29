import React, { useState, useRef, useEffect } from "react";
import "./ChatBotPage.css";
import axios from "axios";

function ChatBotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  // upload fields
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const messagesEndRef = useRef(null);

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
      <div className="chat-title">Medical ChatBOT</div>

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
        <div className="pin-icon" onClick={() => setShowUpload(true)}>
          📎
        </div>

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