import { useState } from "react";

import {
deletePost,
updatePost,
likePost,
unlikePost,
} from "../services/postService";

function ViewPosts({ posts, refreshPosts, currentUser, followedUsers, setFollowedUsers, likedPosts, setLikedPosts }) {

const [editingId, setEditingId] = useState(null);

const [updatedCaption, setUpdatedCaption] = useState("");
const [updatedImageUrl, setUpdatedImageUrl] = useState("");
const [updatedHashtags, setUpdatedHashtags] = useState("");

const [likeMessage, setLikeMessage] = useState(null);

const handleDelete = async (id) => {
try {
await deletePost(id);
alert("Post Deleted");
refreshPosts();
} catch (error) {
console.error(error);
alert("Error deleting post");
}
};

const handleEdit = (post) => {
setEditingId(post.id);
setUpdatedCaption(post.caption);
setUpdatedImageUrl(post.imageUrl);
setUpdatedHashtags(post.hashtags);
};

const handleUpdate = async (id) => {
const updatedPost = {
caption: updatedCaption,
imageUrl: updatedImageUrl,
hashtags: updatedHashtags,
};

try {
  await updatePost(id, updatedPost);
  alert("Post Updated");
  setEditingId(null);
  refreshPosts();
} catch (error) {
  console.error(error);
  alert("Error updating post");
}

};

const handleLike = async (id, postUserId) => {
try {
const isLiked = likedPosts && likedPosts.has(id);
if (isLiked) {
  const response = await unlikePost(id);
  if (response.success) {
    setLikeMessage({ type: "success", text: "Unliked Successfully" });
    if (setLikedPosts) {
      setLikedPosts((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
    refreshPosts();
  }
} else {
  const response = await likePost(id);
  if (response.success) {
    setLikeMessage({ type: "success", text: "Liked Successfully" });
    if (setLikedPosts) {
      setLikedPosts((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    }
    if (postUserId && setFollowedUsers) {
      setFollowedUsers((prev) => {
        const next = new Set(prev);
        next.add(postUserId);
        return next;
      });
    }
    refreshPosts();
  }
}
setTimeout(() => setLikeMessage(null), 2000);
} catch (error) {
const msg =
error?.response?.data?.message ||
"Error";
setLikeMessage({ type: "error", text: msg });
setTimeout(() => setLikeMessage(null), 3000);
}
};

const isOwnPost = (post) => {
return currentUser && post.user &&
post.user.id === currentUser.id;
};

const isFollowingUser = (post) => {
return post.user && followedUsers &&
followedUsers.has(post.user.id);
};

return (
<div className="posts-section">

  {likeMessage && (
    <div className={`like-toast ${likeMessage.type}`}>
      {likeMessage.text}
    </div>
  )}

  <h2 className="posts-title">Recent Posts</h2>

  <div className="posts-container">

    {posts.map((post) => (

      <div
        key={post.id}
        className="post-card"
      >

        {editingId === post.id ? (

          <>
            <input
              type="text"
              value={updatedCaption}
              onChange={(e) =>
                setUpdatedCaption(e.target.value)
              }
            />

            <input
              type="text"
              value={updatedImageUrl}
              onChange={(e) =>
                setUpdatedImageUrl(e.target.value)
              }
            />

            <input
              type="text"
              value={updatedHashtags}
              onChange={(e) =>
                setUpdatedHashtags(e.target.value)
              }
            />

            <button
              onClick={() =>
                handleUpdate(post.id)
              }
            >
              Save
            </button>
          </>

        ) : (

          <>
            <img
              src={post.imageUrl}
              alt="post"
            />

            <div className="post-content">

              {post.user && (
                <p className="post-author">
                  {post.user.username}
                </p>
              )}

              <h3>{post.caption}</h3>

              <p className="hashtags">
                {post.hashtags}
              </p>

              <p className="likes">
                {post.likes} Likes
              </p>

              <p className="time-text">
                {new Date(
                  post.timestamp
                ).toLocaleString()}
              </p>

              {post.updatedAt && (
                <p className="time-text">
                  {new Date(
                    post.updatedAt
                  ).toLocaleString()}
                </p>
              )}

              <div className="button-group">

                {isOwnPost(post) ? (
                  <span className="own-post-badge">
                    Your Post
                  </span>
                ) : isFollowingUser(post) ? (
                  <button
                    className={
                      likedPosts &&
                      likedPosts.has(post.id)
                        ? "unlike-btn-active"
                        : "like-btn-active"
                    }
                    onClick={() =>
                      handleLike(post.id, post.user?.id)
                    }
                  >
                    {likedPosts &&
                    likedPosts.has(post.id)
                      ? "Unlike"
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

                {isOwnPost(post) && (
                  <>
                    <button
                      onClick={() =>
                        handleEdit(post)
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(post.id)
                      }
                    >
                      Delete
                    </button>
                  </>
                )}

              </div>

            </div>

          </>

        )}

      </div>

    ))}

  </div>
</div>


);
}

export default ViewPosts;
