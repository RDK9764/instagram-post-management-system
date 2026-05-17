import { useState } from "react";

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

      // Redirect to Login Page
      navigate("/login");

    } catch (error) {

      console.error(error);

      alert("Registration Failed");
    }
  };

  return (

    <div className="auth-container">

      <h2>Register</h2>

      <form onSubmit={handleSubmit}>

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
          placeholder="Email"
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
          Register
        </button>

      </form>

      <p className="auth-link">

        Already have an account?

        <Link to="/login">
          Login
        </Link>

      </p>

    </div>
  );
}

export default Register;