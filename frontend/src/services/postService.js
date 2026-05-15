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

  return axios.put(
    `${API_URL}/like/${id}`,
    {},
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