import React from "react";
import { Pin, PinOff, Lock, Unlock } from "lucide-react";

const ForumModeration = ({ post, onPinToggle, onLockToggle }) => {
  const handlePinClick = () => {
    onPinToggle(post.id, !post.pinned);
  };

  const handleLockClick = () => {
    onLockToggle(post.id, !post.locked);
  };

  return (
    <div className="flex space-x-4 text-gray-500">
      <button
        onClick={handlePinClick}
        className="flex items-center space-x-1 hover:text-yellow-400"
        title={post.pinned ? "Unpin post" : "Pin post"}
      >
        {post.pinned ? <PinOff size={16} /> : <Pin size={16} />}
        <span className="text-sm">{post.pinned ? "Unpin" : "Pin"}</span>
      </button>

      <button
        onClick={handleLockClick}
        className="flex items-center space-x-1 hover:text-red-400"
        title={post.locked ? "Unlock post" : "Lock post"}
      >
        {post.locked ? <Unlock size={16} /> : <Lock size={16} />}
        <span className="text-sm">{post.locked ? "Unlock" : "Lock"}</span>
      </button>
    </div>
  );
};

export default ForumModeration;
