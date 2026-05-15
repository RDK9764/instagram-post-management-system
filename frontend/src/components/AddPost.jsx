import { useState } from "react";
import { createPost } from "../services/postService";

function AddPost({ refreshPosts }) {
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [hashtags, setHashtags] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      caption,
      imageUrl,
      hashtags,
    };

    try {
      await createPost(postData);

      alert("Post Added Successfully!");

      setCaption("");
      setImageUrl("");
      setHashtags("");

      refreshPosts();
    } catch (error) {
      console.error(error);
      alert("Error adding post");
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Post</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Hashtags"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
        />

        <button type="submit">Add Post</button>
      </form>
    </div>
  );
}

export default AddPost;