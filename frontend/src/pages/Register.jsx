import { useState } from "react";

import {
  registerUser,
} from "../services/authService";

function Register() {

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
          onChange={handleChange}
        />

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
          Register
        </button>

      </form>

    </div>
  );
}

export default Register;