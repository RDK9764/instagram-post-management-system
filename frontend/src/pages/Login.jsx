import { useState } from "react";

import {
  loginUser,
} from "../services/authService";

import { useNavigate } from
  "react-router-dom";

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

      const response =
        await loginUser(loginData);
       
        console.log(response.data);
        
      // Save JWT Token
      localStorage.setItem(
        "token",
        response.data.token
      );

      alert("Login Successful");

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
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit">
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;