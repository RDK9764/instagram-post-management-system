import { useState } from "react";
import "../components/Auth.css";

import {
  loginUser,
} from "../services/authService";

import {
  Link,
  useNavigate,
} from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [loginData, setLoginData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {

    setLoginData({

      ...loginData,

      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await loginUser(loginData);

      localStorage.setItem(
        "userEmail",
        loginData.email
      );

      alert("Login Successful");

      navigate("/");

    } catch (error) {

      console.error(error);

      alert("Invalid Credentials");
    }
  };

  return (

    <div className="auth-page">

      <div className="auth-container">

        {/* Left Side */}

        <div className="auth-left">

          <h1 className="auth-logo">
            SocialSphere
          </h1>

          <p className="auth-tagline">
            Create Posts
            <br />
            Schedule Uploads
            <br />
            Track Engagement
            <br />
            Grow Audience
          </p>



        </div>

        {/* Right Side */}

        <div className="auth-right">

          <h2 className="auth-title">
            Welcome Back
          </h2>

          <p className="auth-subtitle">
            Sign in to continue managing your content.
          </p>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={loginData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleChange}
              required
            />

            <button type="submit">
              Login
            </button>

          </form>

          <p className="auth-link">

            Don't have an account?{" "}

            <Link to="/register">
              Register
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;