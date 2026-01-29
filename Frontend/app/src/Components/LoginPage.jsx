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

        if (response.data === "User exists"){

          alert("Logged in Successfully !");
          navigate("/chat");

        }else{

          alert(response.data);
          
        }
    
    } catch (error) {
      alert("Failed to Login !");
    }

  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>
        <div>
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        New user? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage;
