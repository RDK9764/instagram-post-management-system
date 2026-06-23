import axios from "axios";

const API_URL =
  "http://localhost:9090/api/follow";

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

export const followUser = async (
  userId
) => {
  const response = await axios.post(
    `${API_URL}/${userId}`,
    {},
    getAuthHeader()
  );
  return response.data;
};

export const getFollowersCount =
  async (userId) => {
    return axios.get(
      `${API_URL}/followers-count/${userId}`,
      getAuthHeader()
    );
  };

export const getFollowingCount =
  async (userId) => {
    return axios.get(
      `${API_URL}/following-count/${userId}`,
      getAuthHeader()
    );
  };

export const getFollowers =
  async (userId) => {
    const response = await axios.get(
      `${API_URL}/followers/${userId}`,
      getAuthHeader()
    );
    return response.data;
  };

export const getFollowing =
  async (userId) => {
    const response = await axios.get(
      `${API_URL}/following/${userId}`,
      getAuthHeader()
    );
    return response.data;
  };

export const unfollowUser = async (
  userId
) => {
  const response = await axios.delete(
    `${API_URL}/${userId}`,
    getAuthHeader()
  );
  return response.data;
};

export const isFollowing =
  async (targetUserId) => {
    const response = await axios.get(
      `${API_URL}/is-following/${targetUserId}`,
      getAuthHeader()
    );
    return response.data;
  };
