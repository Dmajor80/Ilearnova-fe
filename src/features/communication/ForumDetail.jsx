import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getForum, getForumPosts, togglePostPin, togglePostLock } from "@/api";
import { Lock, Unlock, Pin, PinOff, Settings } from "lucide-react";
import PostCreation from "./PostCreation";
import PostItem from "./PostItem";

const ForumDetail = () => {
  const { forumId } = useParams();
  const [posts, setPosts] = useState([]);
  const [forum, setForum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('student');

  // Get user role from storage
  useEffect(() => {
    const getUserRole = () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user_data') || sessionStorage.getItem('user_data') || '{}');
        let roles = [];
        if (Array.isArray(userData.roles)) {
          roles = userData.roles.map((r) => String(r.role?.code || "").toLowerCase());
        } else if (typeof userData.role === "string") {
          roles = [String(userData.role).toLowerCase()];
        }
        // Check if user is admin, teacher, or superadmin
        const isModerator = roles.some(role => ['admin', 'teacher', 'superadmin', 'org_admin'].includes(role));
        setUserRole(isModerator ? 'moderator' : 'student');
      } catch (error) {
        console.error('Error getting user role:', error);
        setUserRole('student');
      }
    };
    getUserRole();
  }, []);

  useEffect(() => {
    const fetchForumAndPosts = async () => {
      try {
        const forumResponse = await getForum(forumId);
        if (forumResponse.ok) {
          setForum(forumResponse.data);
        } else {
          setError("Failed to load forum.");
          return;
        }

        const postsResponse = await getForumPosts(forumId);
        if (postsResponse.ok) {
          setPosts(postsResponse.data || []);
        } else {
          setError("Failed to load posts.");
        }
      } catch (err) {
        console.error("Error loading forum and posts:", err);
        setError("Failed to load forum or posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchForumAndPosts();
  }, [forumId]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleReplyAdded = (postId, newReply) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, replies: [...(post.replies || []), newReply] }
          : post
      )
    );
  };

  const handlePinToggle = async (postId, pinned) => {
    try {
      const response = await togglePostPin(forumId, postId);
      if (response.ok) {
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId ? { ...post, pinned: !pinned } : post
          )
        );
      } else {
        alert("Failed to update post pin status.");
      }
    } catch (error) {
      console.error("Error toggling post pin:", error);
      alert("Failed to update post pin status.");
    }
  };

  const handleLockToggle = async (postId, locked) => {
    try {
      const response = await togglePostLock(forumId, postId);
      if (response.ok) {
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId ? { ...post, locked: !locked } : post
          )
        );
      } else {
        alert("Failed to update post lock status.");
      }
    } catch (error) {
      console.error("Error toggling post lock:", error);
      alert("Failed to update post lock status.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading forum...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white text-xl">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/forums"
            className="text-teal-400 hover:text-teal-300 text-sm font-medium mb-4 inline-block"
          >
            ← Back to Forums
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">{forum.title}</h1>
          <p className="text-gray-300 text-lg">{forum.description}</p>
        </div>

        <PostCreation forumId={forumId} onPostCreated={handlePostCreated} />

        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No posts yet. Be the first to start a discussion!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onReplyAdded={handleReplyAdded}
                userRole={userRole}
                onPinToggle={handlePinToggle}
                onLockToggle={handleLockToggle}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumDetail;
