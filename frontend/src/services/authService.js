import axios from "axios";

const API_URL =
  "http://localhost:9090/api/auth";

// Register User
export const registerUser =
  async (userData) => {

    return axios.post(

      `${API_URL}/register`,

      userData
    );
  };

// Login User
export const loginUser =
  async (loginData) => {

    const response =
      await axios.post(

        `${API_URL}/login`,

        loginData
      );

    // Store JWT Token
    localStorage.setItem(

      "token",

      response.data.token
    );

    return response.data;
  };

// Logout User
export const logoutUser = () => {

  localStorage.removeItem(
    "token"
  );
};

// Get Token
export const getToken = () => {

  return localStorage.getItem(
    "token"
  );
};