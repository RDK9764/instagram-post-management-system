import { useState } from "react";

import {
  deletePost,
  updatePost,
  likePost,
} from "../services/postService";

function ViewPosts({ posts, refreshPosts }) {

  const [editingId, setEditingId] =
    useState(null);

  const [updatedCaption, setUpdatedCaption] =
    useState("");

  const [updatedImageUrl, setUpdatedImageUrl] =
    useState("");

  const [updatedHashtags, setUpdatedHashtags] =
    useState("");

  // Delete Post
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

  // Start Editing
  const handleEdit = (post) => {

    setEditingId(post.id);

    setUpdatedCaption(post.caption);

    setUpdatedImageUrl(post.imageUrl);

    setUpdatedHashtags(post.hashtags);
  };

  // Update Post
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

  // Like Post
  const handleLike = async (id) => {

    try {

      await likePost(id);

      refreshPosts();

    } catch (error) {

      console.error(error);

      alert("Error liking post");
    }
  };

  return (

    <div>

      <h2>All Posts</h2>

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
                    setUpdatedCaption(
                      e.target.value
                    )
                  }
                />

                <input
                  type="text"
                  value={updatedImageUrl}
                  onChange={(e) =>
                    setUpdatedImageUrl(
                      e.target.value
                    )
                  }
                />

                <input
                  type="text"
                  value={updatedHashtags}
                  onChange={(e) =>
                    setUpdatedHashtags(
                      e.target.value
                    )
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

                <h3>{post.caption}</h3>

                <p>{post.hashtags}</p>

                <p className="likes">
                  ❤️ Likes: {post.likes}
                </p>

                <p className="date-text">
                  Uploaded:
                </p>

                <p className="time-text">
                  {new Date(
                    post.timestamp
                  ).toLocaleString()}
                </p>

                {post.updatedAt && (

                  <>
                    <p className="date-text">
                      Updated:
                    </p>

                    <p className="time-text">
                      {new Date(
                        post.updatedAt
                      ).toLocaleString()}
                    </p>
                  </>
                )}

                <div className="button-group">

                  <button
                    onClick={() =>
                      handleLike(post.id)
                    }
                  >
                    Like
                  </button>

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