import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getLikedPosts,
  unlikePost,
} from "../services/postService";

import "./ProfilePage.css";

function ActivityPage() {
  const navigate = useNavigate();
  const [likedPosts, setLikedPosts] =
    useState([]);
  const [message, setMessage] =
    useState(null);

  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const data =
          await getLikedPosts();
        setLikedPosts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLiked();
  }, []);

  const handleUnlike =
    async (postId) => {
      try {
        const result =
          await unlikePost(postId);
        if (result.success) {
          setLikedPosts((prev) =>
            prev.filter(
              (p) =>
                p.id !== postId
            )
          );
          setMessage({
            type: "success",
            text: "Unliked Successfully",
          });
          setTimeout(
            () =>
              setMessage(null),
            3000
          );
        }
      } catch (error) {
        const msg =
          error?.response?.data
            ?.message ||
          "Error unliking post";
        setMessage({
          type: "error",
          text: msg,
        });
        setTimeout(
          () => setMessage(null),
          3000
        );
      }
    };

  return (
    <div className="profile-page">
      <button
        className="profile-back-btn"
        onClick={() =>
          navigate("/")
        }
      >
        ← Dashboard
      </button>

      <div className="profile-posts-section">
        {message && (
          <div
            className={`like-toast ${message.type}`}
          >
            {message.text}
          </div>
        )}

        <h2 className="profile-posts-title">
          Your Activity
        </h2>

        <p className="activity-subtitle">
          Posts you have liked
        </p>

        {likedPosts.length === 0 ? (
          <p className="profile-no-posts">
            No liked posts yet.
          </p>
        ) : (
          <div className="profile-posts-grid">
            {likedPosts.map((post) => (
              <div
                key={post.id}
                className="profile-post-card"
              >
                <img
                  src={
                    post.imageUrl
                  }
                  alt="post"
                />

                <div className="profile-post-content">
                  {post.user && (
                    <p className="post-author">
                      {
                        post.user
                          .username
                      }
                    </p>
                  )}

                  <h3>
                    {post.caption}
                  </h3>

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
                    <button
                      className="unlike-btn"
                      onClick={() =>
                        handleUnlike(
                          post.id
                        )
                      }
                    >
                      Unlike
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityPage;
