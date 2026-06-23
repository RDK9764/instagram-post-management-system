import axios from "axios";

const API_URL =
  "http://localhost:9090/api/users";

const getAuthHeader = () => {
  const token =
    localStorage.getItem("token");
  return {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };
};

export const getCurrentUser =
  async () => {
    return axios.get(
      `${API_URL}/me`,
      getAuthHeader()
    );
  };

export const searchUsers = async (
  username
) => {
  return axios.get(
    `${API_URL}/search?username=${username}`,
    getAuthHeader()
  );
};

export const getUserById = async (
  id
) => {
  return axios.get(
    `${API_URL}/${id}`,
    getAuthHeader()
  );
};
