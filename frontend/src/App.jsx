import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import AddPost from "./components/AddPost";
import ViewPosts from "./components/ViewPosts";
import FollowModal from "./components/FollowModal";
import UserListModal from "./components/UserListModal";

import {
  getAllPosts,
  getMyPosts,
  getPostsSortedAscending,
  getPostsSortedDescending,
  getPostsByHashtag,
} from "./services/postService";

import {
  getCurrentUser,
  searchUsers,
} from "./services/userService";

import {
  followUser,
  unfollowUser,
  getFollowersCount,
  getFollowingCount,
  getFollowers,
  getFollowing,
} from "./services/followService";

import "./App.css";

function App() {
  const navigate = useNavigate();

  // Store Feed Posts
  const [posts, setPosts] = useState([]);

  // Store Own Posts (for scheduled count + timer)
  const [myPosts, setMyPosts] = useState([]);

  // Search State
  const [searchTag, setSearchTag] = useState("");

  // Active Sort State
  const [activeSort, setActiveSort] = useState("");

  // User Profile State
  const [currentUser, setCurrentUser] =
    useState(null);
  const [followersCount, setFollowersCount] =
    useState(0);
  const [followingCount, setFollowingCount] =
    useState(0);

  // User Search State
  const [searchUsername, setSearchUsername] =
    useState("");
  const [searchResults, setSearchResults] =
    useState([]);

  // Followed Users Set (store IDs of followed users)
  const [followedUsers, setFollowedUsers] =
    useState(new Set());

  // Follow Modal State
  const [followModal, setFollowModal] =
    useState(null);

  // User List Modal (Followers / Following)
  const [userListModal, setUserListModal] =
    useState(null);

  // Liked Posts Set (track liked post IDs for like/unlike toggle)
  const [likedPosts, setLikedPosts] =
    useState(new Set());

  // Scheduled Countdown Timer
  const [scheduledCountdown, setScheduledCountdown] =
    useState("");
  const timerRef = useRef(null);

  // Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    window.location.href = "/login";
  };

  // Fetch Current User Profile
  const fetchCurrentUser = async () => {
    try {
      const response =
        await getCurrentUser();
      const user = response.data;
      setCurrentUser(user);

      const [followersRes, followingRes] =
        await Promise.all([
          getFollowersCount(user.id),
          getFollowingCount(user.id),
        ]);

      setFollowersCount(
        followersRes.data
      );
      setFollowingCount(
        followingRes.data
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch Own Posts (for scheduled count + timer)
  const fetchMyPosts = async () => {
    try {
      const response =
        await getMyPosts();
      setMyPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Update scheduled countdown every second
  useEffect(() => {
    const scheduledPosts = myPosts.filter(
      (p) => p.scheduled && !p.published
    );
    if (scheduledPosts.length === 0) {
      setScheduledCountdown("");
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      let nearest = null;
      for (const p of scheduledPosts) {
        if (p.scheduledTime) {
          const t = new Date(p.scheduledTime);
          if (t > now) {
            if (!nearest || t < nearest) {
              nearest = t;
            }
          }
        }
      }
      if (nearest) {
        const diff =
          nearest.getTime() - now.getTime();
        const days = Math.floor(
          diff / (1000 * 60 * 60 * 24)
        );
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );
        const mins = Math.floor(
          (diff % (1000 * 60 * 60)) /
            (1000 * 60)
        );
        const secs = Math.floor(
          (diff % (1000 * 60)) / 1000
        );
        setScheduledCountdown(
          `Next: ${days}d ${hours}h ${mins}m ${secs}s`
        );
      } else {
        setScheduledCountdown("");
      }
    };

    updateTimer();
    timerRef.current =
      setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(
          timerRef.current
        );
      }
    };
  }, [myPosts]);

  // Search Users
  const handleSearchUsers =
    async () => {
      if (!searchUsername.trim()) return;
      try {
        const response =
          await searchUsers(
            searchUsername
          );
        const users = response.data;
        setSearchResults(users);

        const next = new Set(followedUsers);
        users.forEach((u) => {
          if (u.isFollowing) {
            next.add(u.id);
          }
        });
        setFollowedUsers(next);
      } catch (error) {
        console.error(error);
      }
    };

  // Follow / Unfollow User (toggle)
  const handleFollow =
    async (userId, username) => {
      try {
        if (followedUsers.has(userId)) {
          const result =
            await unfollowUser(userId);
          if (result.success) {
            setFollowedUsers(
              (prev) => {
                const next =
                  new Set(prev);
                next.delete(userId);
                return next;
              }
            );
            fetchCurrentUser();
          }
        } else {
          const result =
            await followUser(userId);
          if (result.success) {
            setFollowedUsers(
              (prev) => {
                const next =
                  new Set(prev);
                next.add(userId);
                return next;
              }
            );
            setFollowModal({
              userId,
              username,
            });
            fetchCurrentUser();
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

  // Open Followers Modal
  const openFollowersModal =
    async () => {
      try {
        const users =
          await getFollowers(
            currentUser.id
          );
        setUserListModal({
          title: "Followers",
          users,
        });
      } catch (error) {
        console.error(error);
      }
    };

  // Open Following Modal
  const openFollowingModal =
    async () => {
      try {
        const users =
          await getFollowing(
            currentUser.id
          );
        setUserListModal({
          title: "Following",
          users,
        });
      } catch (error) {
        console.error(error);
      }
    };

  // Fetch All Posts (feed)
  const fetchPosts = async () => {
    try {
      const response = await getAllPosts();

      console.log(response.data);

      setPosts(response.data);

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
        await getPostsByHashtag(searchTag);

      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchPosts();
    fetchCurrentUser();
    fetchMyPosts();
  }, []);

  return (
    <div className="app">

      {/* Header */}
      <div className="header">

  <div className="hero-content">

    <h1 className="main-title">
      SocialSphere
    </h1>

    <p className="sub-title">
      Create • Schedule • Share
    </p>

    <div className="hero-dashboard">

      <h3>
        Manage Your Content Smarter
      </h3>

      <p>
        Create Posts • Schedule Uploads •
        Track Engagement • Grow Audience
      </p>

    </div>

  </div>

  <div className="header-actions">

      <button
        className="nav-btn"
        onClick={() =>
          navigate("/activity")
        }
      >
        Activity
      </button>

      <button
        className="logout-btn"
        onClick={logout}
      >
        Logout
      </button>

    </div>

</div>

      {/* Profile Section */}
      {currentUser && (
        <div className="profile-section">

          <div className="profile-card">

            <div className="profile-avatar">
              {currentUser.username
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="profile-info">

              <h2>
                {currentUser.username}
              </h2>

              <p>
                {currentUser.email}
              </p>

            </div>

              <div className="profile-stats">

              <div className="profile-stat">
                <h3>{posts.length}</h3>
                <span>Posts</span>
              </div>

              <div
                className="profile-stat clickable-stat"
                onClick={
                  openFollowersModal
                }
              >
                <h3>
                  {followersCount}
                </h3>
                <span>Followers</span>
              </div>

              <div
                className="profile-stat clickable-stat"
                onClick={
                  openFollowingModal
                }
              >
                <h3>
                  {followingCount}
                </h3>
                <span>Following</span>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* User Search */}
      <div className="user-search-section">

        <div className="user-search-box">

          <input
            type="text"
            placeholder="Search users by username..."
            value={searchUsername}
            onChange={(e) =>
              setSearchUsername(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter"
              ) {
                handleSearchUsers();
              }
            }}
          />

          <button
            onClick={handleSearchUsers}
          >
            Search
          </button>

        </div>

        {searchResults.length > 0 && (
          <div className="user-results">

            {searchResults
              .filter(
                (u) =>
                  u.id !==
                  currentUser?.id
              )
              .map((user) => (
                <div
                  key={user.id}
                  className="user-result-card"
                >
                  <div className="user-result-avatar">
                    {user.username
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="user-result-info">
                    <h4>
                      {user.username}
                    </h4>
                    <p>
                      {user.email}
                    </p>
                  </div>

                  <button
                    className={
                      followedUsers.has(
                        user.id
                      )
                        ? "following-btn"
                        : "follow-btn"
                    }
                    onClick={() =>
                      handleFollow(
                        user.id,
                        user.username
                      )
                    }
                  >
                    {followedUsers.has(
                      user.id
                    )
                      ? "Following"
                      : "Follow"}
                  </button>

                </div>
              ))}

          </div>
        )}

      </div>

      {/* Dashboard Banner */}
      <div className="dashboard-banner">

        <div className="stat-card">
          <h3>{posts.length}</h3>
          <p>Total Posts</p>
        </div>

        <div className="stat-card">
          <h3>
            {
              myPosts.filter(
                (post) => post.scheduled && !post.published
              ).length
            }
          </h3>
          <p>Scheduled</p>
          {scheduledCountdown && (
            <p className="scheduled-timer">
              {scheduledCountdown}
            </p>
          )}
        </div>

        <div className="stat-card">
          <h3>
            {
              posts.reduce(
                (sum, post) =>
                  sum + (post.likes || 0),
                0
              )
            }
          </h3>
          <p>Total Likes</p>
        </div>

      </div>

      {/* Add Post */}
      <AddPost
        refreshPosts={fetchPosts}
      />

      {/* Toolbar */}
      <div className="toolbar">

        <div className="search-box">

          <input
            type="text"
            placeholder="# Search hashtag"
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

        <div className="sort-buttons">

          <button
            className={
              activeSort === "asc"
                ? "active-sort"
                : ""
            }
            onClick={sortAscending}
          >
            ↑ Oldest
          </button>

          <button
            className={
              activeSort === "desc"
                ? "active-sort"
                : ""
            }
            onClick={sortDescending}
          >
            ↓ Latest
          </button>

        </div>

      </div>

      {/* Posts */}
      <ViewPosts
        posts={posts}
        refreshPosts={fetchPosts}
        currentUser={currentUser}
        followedUsers={followedUsers}
        setFollowedUsers={setFollowedUsers}
        likedPosts={likedPosts}
        setLikedPosts={setLikedPosts}
      />

      {/* Follow Success Modal */}
      {followModal && (
        <FollowModal
          username={
            followModal.username
          }
          userId={
            followModal.userId
          }
          onClose={() =>
            setFollowModal(null)
          }
        />
      )}

      {/* User List Modal (Followers / Following) */}
      {userListModal && (
        <UserListModal
          title={
            userListModal.title
          }
          users={
            userListModal.users
          }
          onClose={() =>
            setUserListModal(null)
          }
        />
      )}

    </div>
  );
}

export default App;