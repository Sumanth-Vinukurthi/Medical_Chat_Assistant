import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import "./LoginPage.css";
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    try{

        const response = await axios.post("http://127.0.0.1:7000/login",
          {
            username : email,
            password : password
          }
        );

        if (response.data.status === "success") {

              const role = response.data.role;

              alert("Logged in successfully!");

              localStorage.setItem("isLoggedIn", "true");

              navigate("/chat", { state: { role } });

          } else {

              alert(response.data.message);

          }
    
    } catch (error) {
      alert("Failed to Login !");
    }

  };

  return (
  <div className="login-wrapper">
    <div className="login-card">

      <h1 className="app-title">Medical Chat Assistant</h1>
      <p className="app-subtitle">AI-powered medical knowledge assistant</p>

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <p className="register-text">
        New user? <Link to="/register">Register here</Link>
      </p>

    </div>
  </div>
);

};

export default LoginPage;
