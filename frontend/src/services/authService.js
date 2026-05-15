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

    return axios.post(
      `${API_URL}/login`,
      loginData
    );
  };