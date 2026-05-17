import { useState } from "react";

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

      // Login Request
      await loginUser(loginData);

      alert("Login Successful");

      // Redirect Home
      navigate("/");

    } catch (error) {

      console.error(error);

      alert("Invalid Credentials");
    }
  };

  return (

    <div className="auth-container">

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Email"
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

      <p>

        Don't have an account?

        <Link to="/register">
          Register
        </Link>

      </p>

    </div>
  );
}

export default Login;