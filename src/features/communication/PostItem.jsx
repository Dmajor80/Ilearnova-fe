import React, { useState } from "react";
import { replyToForumPost } from "@/api";
import ForumModeration from "./ForumModeration";

/**
 * PostItem component displays a single forum post with reply functionality
 * @param {Object} post - The post object containing content, user info, etc.
 * @param {Function} onReplyAdded - Callback function when a reply is added
 * @param {string} userRole - Role of the current user ('moderator' or 'student')
 * @param {Function} onPinToggle - Callback function to toggle post pin status
 * @param {Function} onLockToggle - Callback function to toggle post lock status
 */
const PostItem = ({ post, onReplyAdded, userRole, onPinToggle, onLockToggle }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replies, setReplies] = useState(post.replies || []);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmittingReply(true);
    try {
      const response = await replyToForumPost(post.forum_id, post.id, {
        content: replyContent.trim(),
      });
      if (response.ok) {
        setReplies((prev) => [...prev, response.data]);
        setReplyContent("");
        setShowReplyForm(false);
        if (onReplyAdded) {
          onReplyAdded(post.id, response.data);
        }
      } else {
        alert("Failed to add reply. Please try again.");
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      alert("Failed to add reply. Please try again.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-4">
      <div className="flex items-start space-x-3 md:space-x-4">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base">
            {post.user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2">
            <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">{post.user?.name || "Anonymous"}</h4>
            <span className="text-xs md:text-sm text-gray-500">
              {new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-gray-700 mb-4 whitespace-pre-wrap text-sm md:text-base break-words">{post.content}</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-teal-600 hover:text-teal-800 text-sm font-medium self-start"
            >
              Reply
            </button>
            {userRole === 'moderator' && (
              <ForumModeration
                post={post}
                onPinToggle={onPinToggle}
                onLockToggle={onLockToggle}
              />
            )}
          </div>
        </div>
      </div>

      {showReplyForm && (
        <div className="mt-4 ml-10 md:ml-14">
          <form onSubmit={handleReplySubmit}>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-vertical text-sm md:text-base"
              rows={3}
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              required
            />
            <div className="mt-2 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
              <button
                type="submit"
                disabled={isSubmittingReply || !replyContent.trim()}
                className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
              >
                {isSubmittingReply ? "Replying..." : "Reply"}
              </button>
              <button
                type="button"
                onClick={() => setShowReplyForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm md:text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {replies.length > 0 && (
        <div className="mt-4 ml-10 md:ml-14 space-y-3">
          {replies.map((reply) => (
            <div key={reply.id} className="bg-gray-50 p-3 md:p-4 rounded-md">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-teal-400 rounded-full flex items-center justify-center text-white font-semibold text-xs md:text-sm">
                  {reply.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="font-medium text-gray-900 text-xs md:text-sm truncate">{reply.user?.name || "Anonymous"}</span>
                <span className="text-xs text-gray-500">
                  {new Date(reply.created_at).toLocaleDateString()} at {new Date(reply.created_at).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-700 text-xs md:text-sm whitespace-pre-wrap break-words">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostItem;
