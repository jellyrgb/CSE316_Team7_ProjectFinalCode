import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config.tsx";
import Cookies from "js-cookie";
import { useUserContext } from "../context/UserContext";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePassWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/signin`, {
        username,
        password,
      });

      if (response.status === 200) {
        Cookies.set("userToken", response.data.id, { expires: 1 });
        alert("Successfully signed in!");

        setUser({
          id: response.data.id,
          username: response.data.username,
          profile_image: response.data.profile_image,
          creation_date: response.data.creation_date,
          balance: response.data.balance,
        });

        navigate("/");
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 401
      ) {
        alert("Wrong email or wrong password.");
      } else {
        console.error("Error signing in:", error);
        alert("Error signing in");
      }
    }
  };

  const handleSignUpNavigate = () => {
    navigate("/signUp");
  };

  return (
    <div className="container mt-4">
      <div className="sign-container fullscreen">
        <h2>Please Log In Here!</h2>
        <form className="sign-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="username"
            id="username"
            onChange={handleName}
            value={username}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={handlePassWord}
            value={password}
          />

          <div className="button-group">
            <button
              type="submit"
              className="sign-in-button btn btn-outline-success"
            >
              Sign In
            </button>
            <button
              type="button"
              className="sign-up-button btn btn-outline-primary"
              onClick={handleSignUpNavigate}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
