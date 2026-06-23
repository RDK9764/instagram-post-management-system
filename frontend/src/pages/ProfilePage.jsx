import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getCurrentUser,
  getUserById,
} from "../services/userService";

import {
  getPostsByUserId,
  likePost,
} from "../services/postService";

import {
  getFollowersCount,
  getFollowingCount,
  getFollowers,
  getFollowing,
  isFollowing,
} from "../services/followService";

import UserListModal from
  "../components/UserListModal";

import "./ProfilePage.css";

function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] =
    useState(null);
  const [currentUser, setCurrentUser] =
    useState(null);
  const [posts, setPosts] = useState([]);
  const [followersCount, setFollowersCount] =
    useState(0);
  const [followingCount, setFollowingCount] =
    useState(0);
  const [userListModal, setUserListModal] =
    useState(null);
  const [followsProfile, setFollowsProfile] =
    useState(false);
  const [likeMessage, setLikeMessage] =
    useState(null);
  const [likedPosts, setLikedPosts] =
    useState(new Set());

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const meRes =
          await getCurrentUser();
        const me = meRes.data;
        setCurrentUser(me);

        const followRes =
          await isFollowing(userId);
        setFollowsProfile(
          followRes.following
        );

        const userRes =
          await getUserById(userId);
        const user = userRes.data;
        setProfileUser(user);

        const [postsRes, followersRes, followingRes] =
          await Promise.all([
            getPostsByUserId(userId),
            getFollowersCount(userId),
            getFollowingCount(userId),
          ]);

        setPosts(postsRes.data);
        setFollowersCount(followersRes.data);
        setFollowingCount(followingRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleLike = async (postId) => {
    try {
      const response =
        await likePost(postId);
      if (response.success) {
        setLikedPosts((prev) => {
          const next = new Set(prev);
          next.add(postId);
          return next;
        });
        setLikeMessage({
          type: "success",
          text: "Liked Successfully",
        });
        const postsRes =
          await getPostsByUserId(userId);
        setPosts(postsRes.data);
        setTimeout(
          () => setLikeMessage(null),
          3000
        );
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Error liking post";
      setLikeMessage({
        type: "error",
        text: msg,
      });
      setTimeout(
        () => setLikeMessage(null),
        3000
      );
    }
  };

  if (!profileUser) {
    return (
      <div className="profile-loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="profile-page">

      <button
        className="profile-back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="profile-header-card">

        <div className="profile-page-avatar">
          {profileUser.username
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="profile-page-info">

          <h1>
            {profileUser.username}
          </h1>

          <p className="profile-page-email">
            {profileUser.email}
          </p>

        </div>

        <div className="profile-page-stats">

          <div className="profile-page-stat">
            <h3>{posts.length}</h3>
            <span>Posts</span>
          </div>

          <div
            className="profile-page-stat clickable-stat"
            onClick={async () => {
              try {
                const users =
                  await getFollowers(
                    userId
                  );
                setUserListModal({
                  title: "Followers",
                  users,
                });
              } catch (e) {
                console.error(e);
              }
            }}
          >
            <h3>{followersCount}</h3>
            <span>Followers</span>
          </div>

          <div
            className="profile-page-stat clickable-stat"
            onClick={async () => {
              try {
                const users =
                  await getFollowing(
                    userId
                  );
                setUserListModal({
                  title: "Following",
                  users,
                });
              } catch (e) {
                console.error(e);
              }
            }}
          >
            <h3>{followingCount}</h3>
            <span>Following</span>
          </div>

        </div>

      </div>

      <div className="profile-posts-section">

        {likeMessage && (
          <div className={`like-toast ${likeMessage.type}`}>
            {likeMessage.text}
          </div>
        )}

        <h2 className="profile-posts-title">
          Posts by{" "}
          {profileUser.username}
        </h2>

        {posts.length === 0 ? (
          <p className="profile-no-posts">
            No posts yet.
          </p>
        ) : (
          <div className="profile-posts-grid">

            {posts.map((post) => (
              <div
                key={post.id}
                className="profile-post-card"
              >
                <img
                  src={post.imageUrl}
                  alt="post"
                />

                <div className="profile-post-content">

                  <h3>{post.caption}</h3>

                  <p className="profile-post-hashtags">
                    {post.hashtags}
                  </p>

                  <p className="profile-post-likes">
                    {post.likes} Likes
                  </p>

                  <p className="profile-post-time">
                    {new Date(
                      post.timestamp
                    ).toLocaleString()}
                  </p>

                  <div className="button-group">

                    {currentUser &&
                    currentUser.id ===
                      Number(userId) ? (
                      <span className="own-post-badge">
                        Your Post
                      </span>
                    ) : followsProfile ? (
                      <button
                        className="like-btn-active"
                        onClick={() =>
                          handleLike(post.id)
                        }
                        disabled={likedPosts.has(post.id)}
                      >
                        {likedPosts.has(post.id)
                          ? "Liked"
                          : "Like"}
                      </button>
                    ) : (
                      <span
                        className="like-btn-disabled"
                        title="Follow this user to like their posts"
                      >
                        Follow to Like
                      </span>
                    )}

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

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

export default ProfilePage;
