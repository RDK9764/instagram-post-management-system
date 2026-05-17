import { useState } from "react";

import { createPost }
from "../services/postService";

function AddPost({ refreshPosts }) {

  const [caption, setCaption] =
    useState("");

  const [imageUrl, setImageUrl] =
    useState("");

  const [hashtags, setHashtags] =
    useState("");

  // Scheduling States
  const [scheduled, setScheduled] =
    useState(false);

  const [scheduledTime,
    setScheduledTime] =
    useState("");

  // Submit Form
  const handleSubmit = async (e) => {

    e.preventDefault();

    const postData = {

      caption,
      imageUrl,
      hashtags,

      scheduled,
      scheduledTime,
    };

    try {

      await createPost(postData);

      if(scheduled) {

        alert(
          "Post Scheduled Successfully!"
        );

      } else {

        alert(
          "Post Added Successfully!"
        );
      }

      // Reset Fields
      setCaption("");

      setImageUrl("");

      setHashtags("");

      setScheduled(false);

      setScheduledTime("");

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

        {/* Caption */}
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) =>
            setCaption(e.target.value)
          }
          required
        />

        {/* Image URL */}
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) =>
            setImageUrl(e.target.value)
          }
          required
        />

        {/* Hashtags */}
        <input
          type="text"
          placeholder="Hashtags"
          value={hashtags}
          onChange={(e) =>
            setHashtags(e.target.value)
          }
        />

        {/* Schedule Checkbox */}
        <label className="schedule-label">

          <input
            type="checkbox"
            checked={scheduled}
            onChange={(e) =>
              setScheduled(
                e.target.checked
              )
            }
          />

          Schedule this post

        </label>

        {/* Date Time Picker */}
        {
          scheduled && (

            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) =>
                setScheduledTime(
                  e.target.value
                )
              }
              required
            />
          )
        }

        {/* Submit Button */}
        <button type="submit">

          {
            scheduled
              ? "Schedule Post"
              : "Add Post"
          }

        </button>

      </form>

    </div>
  );
}

export default AddPost;