import { useEffect, useState } from "react";

import AddPost from "./components/AddPost";
import ViewPosts from "./components/ViewPosts";

import {
  getAllPosts,
  getPostsSortedAscending,
  getPostsSortedDescending,
  getPostsByHashtag,
} from "./services/postService";

import "./App.css";

function App() {

  // Store Posts
  const [posts, setPosts] = useState([]);

  // Search State
  const [searchTag, setSearchTag] =
    useState("");

  // Active Sort State
  const [activeSort, setActiveSort] =
    useState("");

  // Logout Function
  const logout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  // Fetch All Posts
  const fetchPosts = async () => {

    try {

      const response =
        await getAllPosts();
      console.log(response.data);
      setPosts(response.data);

      // Reset sort
      setActiveSort("");

    } catch (error) {

      console.error(error);
    }
  };

  // Sort Ascending
  const sortAscending = async () => {

    try {

      const response =
        await getPostsSortedAscending();

      setPosts(response.data);

      setActiveSort("asc");

    } catch (error) {

      console.error(error);
    }
  };

  // Sort Descending
  const sortDescending = async () => {

    try {

      const response =
        await getPostsSortedDescending();

      setPosts(response.data);

      setActiveSort("desc");

    } catch (error) {

      console.error(error);
    }
  };

  // Search Posts
  const searchPosts = async () => {

    try {

      const response =
        await getPostsByHashtag(
          searchTag
        );

      setPosts(response.data);

    } catch (error) {

      console.error(error);
    }
  };

  // Initial Load
  useEffect(() => {

    fetchPosts();

  }, []);

  return (

    <div className="app">

      {/* Header */}
      <div className="header">

        <h1>
          Instagram Post Management
        </h1>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

      {/* Add Post */}
      <AddPost
        refreshPosts={fetchPosts}
      />

      {/* Search Section */}
      <div className="search-box">

        <input
          type="text"
          placeholder="Search hashtag"
          value={searchTag}
          onChange={(e) =>
            setSearchTag(
              e.target.value
            )
          }
        />

        <button onClick={searchPosts}>
          Search
        </button>

        <button onClick={fetchPosts}>
          Reset
        </button>

      </div>

      {/* Sort Buttons */}
      <div className="sort-buttons">

        <button
          className={
            activeSort === "asc"
              ? "active-sort"
              : ""
          }
          onClick={sortAscending}
        >
          Sort Asc
        </button>

        <button
          className={
            activeSort === "desc"
              ? "active-sort"
              : ""
          }
          onClick={sortDescending}
        >
          Sort Desc
        </button>

      </div>

      {/* View Posts */}
      <ViewPosts
        posts={posts}
        refreshPosts={fetchPosts}
      />

    </div>
  );
}

export default App;