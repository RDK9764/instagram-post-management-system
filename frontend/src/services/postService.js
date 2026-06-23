import axios from "axios";

const API_URL =
  "http://localhost:9090/api/posts";

// Get JWT Token
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

// Get All Posts
export const getAllPosts = async () => {

  return axios.get(
    `${API_URL}/allPosts`,
    getAuthHeader()
  );
};

// Add New Post
export const createPost = async (
  post
) => {

  return axios.post(
    `${API_URL}/addPost`,
    post,
    getAuthHeader()
  );
};

// Delete Post
export const deletePost = async (
  id
) => {

  return axios.delete(
    `${API_URL}/${id}`,
    getAuthHeader()
  );
};

// Update Post
export const updatePost = async (
  id,
  updatedPost
) => {

  return axios.put(
    `${API_URL}/update/${id}`,
    updatedPost,
    getAuthHeader()
  );
};

// Like Post
export const likePost = async (
  id
) => {

  const response = await axios.put(
    `${API_URL}/like/${id}`,
    {},
    getAuthHeader()
  );
  return response.data;
};

// Unlike Post
export const unlikePost = async (
  id
) => {

  const response = await axios.delete(
    `${API_URL}/like/${id}`,
    getAuthHeader()
  );
  return response.data;
};

// Get Liked Posts (Activity)
export const getLikedPosts = async () => {

  const response = await axios.get(
    `${API_URL}/liked`,
    getAuthHeader()
  );
  return response.data;
};

// Get My Posts (for dashboard)
export const getMyPosts = async () => {

  return axios.get(
    `${API_URL}/my`,
    getAuthHeader()
  );
};

// Filter By Hashtag
export const getPostsByHashtag =
  async (tag) => {

    return axios.get(
      `${API_URL}/byHashtag?tag=${tag}`,
      getAuthHeader()
    );
  };

// Sort Descending
export const getPostsSortedDescending =
  async () => {

    return axios.get(
      `${API_URL}/sortedDesc`,
      getAuthHeader()
    );
  };

// Sort Ascending
export const getPostsSortedAscending =
  async () => {

    return axios.get(
      `${API_URL}/sortedAsc`,
      getAuthHeader()
    );
  };

// Get Posts By User ID
export const getPostsByUserId =
  async (userId) => {

    return axios.get(
      `${API_URL}/user/${userId}`,
      getAuthHeader()
    );
  };