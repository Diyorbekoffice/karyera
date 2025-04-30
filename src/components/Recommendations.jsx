import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../axios";
import { FaUserCircle } from "react-icons/fa";

function Recommendations() {
  const [users, setUsers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [following, setFollowing] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      const token = localStorage.getItem("accessToken");
      const response = await instance.get("/api/recommendations/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    };

    fetchRecommendations();
  }, []);

  const handleFollow = async (userId) => {
    const token = localStorage.getItem("accessToken");
    await instance.post(
      "/api/follow-user-to-user/",
      { user_id: userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setFollowing((prev) => ({
      ...prev,
      [userId]: true,
    }));
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const visibleUsers = users.slice(0, visibleCount);
  const isEnd = visibleUsers.length >= users.length;

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Balki tanishlaringiz</h2>
      <ul className="space-y-4">
        {visibleUsers.map((user) => (
          <li key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                onClick={() => handleUserClick(user.id)}
                className="flex items-center space-x-3 cursor-pointer"
              >
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={user.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-10 h-10 text-gray-400" />
                )}
                <p className="font-semibold hover:underline">{user.full_name}</p>
              </div>
            </div>
            <button
              onClick={() => handleFollow(user.user.id)}
              disabled={following[user.user.id]}
              className={`border px-3 py-1 rounded-full ${
                following[user.user.id]
                  ? "border-gray-400 text-gray-500 cursor-not-allowed"
                  : "border-blue-500 text-blue-500 hover:bg-blue-50"
              }`}
            >
              {following[user.user.id] ? "Kutilmoqda" : "kuzatish +"}
            </button>
          </li>
        ))}
      </ul>

      {!isEnd && (
        <div className="text-center mt-4">
          <button
            onClick={handleLoadMore}
            className="text-blue-600 font-medium"
          >
            Yana
          </button>
        </div>
      )}
    </div>
  );
}

export default Recommendations;