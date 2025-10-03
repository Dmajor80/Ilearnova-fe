import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getForums } from "@/api";

const ForumList = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await getForums();
        if (response.ok) {
          setForums(response.data || []);
        } else {
          setError("Failed to load forums.");
        }
      } catch (err) {
        console.error("Error loading forums:", err);
        setError("Failed to load forums.");
      } finally {
        setLoading(false);
      }
    };
    fetchForums();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading forums...</div>
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
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Discussion Forums</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join the conversation! Share ideas, ask questions, and connect with your learning community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(forums || []).map((forum) => (
            <Link
              key={forum.id}
              to={`/forums/${forum.id}`}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 block"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  {forum.title.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-teal-600 transition-colors">
                    {forum.title}
                  </h3>
                  <p className="text-sm text-gray-500">Forum</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 line-clamp-3">{forum.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{forum.posts_count || 0} posts</span>
                <span>Last activity: {forum.updated_at ? new Date(forum.updated_at).toLocaleDateString() : 'Never'}</span>
              </div>
            </Link>
          ))}
        </div>

        {forums.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No forums available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumList;
