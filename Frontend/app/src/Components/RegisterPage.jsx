import React, { useState } from "react";
import axios from "axios";
import "./RegisterPage.css";
import { Link,useNavigate } from "react-router-dom";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const role = "user";
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    let err = {};

    // Email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      err.email = "Enter a valid email";
    }

    // Password length
    if (password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    // Confirm password match
    if (password !== confirmPassword) {
      err.confirmPassword = "Passwords do not match";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const register = async () => {
    if (!validateInputs()) return;

    try {
      const response = await axios.post("http://127.0.0.1:7000/register", {
        username: email,
        password: password,
        role:role
      });
    
      console.log(response.data)
      alert(response.data);

    } catch (error) {
      alert("Registration failed!");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2>Register</h2>

        {/* EMAIL INPUT */}
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="reg-input"
        />
        {errors.email && <p className="error-text">{errors.email}</p>}

        {/* PASSWORD INPUT */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="reg-input"
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        {/* CONFIRM PASSWORD */}
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="reg-input"
        />
        {errors.confirmPassword && (
          <p className="error-text">{errors.confirmPassword}</p>
        )}

        {/* REGISTER BUTTON */}
        <button className="reg-btn" onClick={register}>
          Register
        </button>

        {/* LOGIN LINK */}
        <p>
        Already have an account? <Link to="/">Login here</Link>
      </p>
      </div>
    </div>
  );
}

export default RegisterPage;