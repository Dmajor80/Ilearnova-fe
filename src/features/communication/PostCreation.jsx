import React, { useState } from "react";
import { createForumPost } from "@/api";

/**
 * PostCreation component allows users to create new forum posts
 * @param {string|number} forumId - The ID of the forum where the post will be created
 * @param {Function} onPostCreated - Callback function called when a post is successfully created
 */
const PostCreation = ({ forumId, onPostCreated }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await createForumPost(forumId, {
        content: content.trim(),
      });
      if (response.ok) {
        setContent("");
        if (onPostCreated) {
          onPostCreated(response.data);
        }
      } else {
        alert("Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-800">Create New Post</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-vertical text-sm md:text-base"
          rows={4}
          placeholder="Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="mt-3 px-4 md:px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default PostCreation;
