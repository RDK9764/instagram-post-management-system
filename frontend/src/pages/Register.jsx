import { useState } from "react";
import "../components/Auth.css";
import {
  useNavigate,
  Link,
} from "react-router-dom";

import {
  registerUser,
} from "../services/authService";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      username: "",
      email: "",
      password: "",
    });

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await registerUser(formData);

      alert(
        "User Registered Successfully"
      );

      navigate("/login");

    } catch (error) {

      console.error(error);

      alert("Registration Failed");
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
            Create Account
          </h2>

          <p className="auth-subtitle">
            Join SocialSphere and start managing content smarter.
          </p>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit">
              Create Account
            </button>

          </form>

          <p className="auth-link">

            Already have an account?{" "}

            <Link to="/login">
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;