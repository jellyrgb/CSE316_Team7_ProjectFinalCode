
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config.tsx';
import "../css/SignUp.css";

function SignUp() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!username || !password || !confirmPassword) {
          alert("Please fill in all fields.");
          return;
        }
    
        if (password !== confirmPassword) {
          alert("Confirm password is not the same with password.");
          return;
        }
    
        try {
          const response = await axios.post(`${API_BASE_URL}/api/signup`, {
            username,
            password
          });
    
          if (response.status === 201) {
            alert("User registered successfully!");
            navigate("/signIn");
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response && error.response.status === 400 && error.response.data.error === 'Username already exists') {
            alert("Username already exists.");
          } else {
            console.error("Error signing up:", error);
            alert("Error signing up.");
          }
        }
      };

    return (
      <div>
        <div className="sign-container fullscreen">
          <h2>Let's Get Started!</h2>
          <form className="sign-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Username</label>
            <input type="username" id="username" onChange={(e) => setUsername(e.target.value)} value={username}/>

            <label htmlFor="password">Password</label>
            <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password}/>

            <label htmlFor="password">Password Check</label>
            <input type="password" id="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword}/>

            <div className="button-group">
            <button type="submit" className="sign-up-button">Sign Up</button>
            </div>
          </form>
        </div>
      </div>
    );
}

export default SignUp;
