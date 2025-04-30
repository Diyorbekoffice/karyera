import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../axios";
import { FaUserCircle } from "react-icons/fa";

function Recommendations() {
  const [users, setUsers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      const token = localStorage.getItem("accessToken");
      const response = await instance.get("/api/recommendations/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Filter out users with "tasdiqlashingiz_kutilmoqda" status immediately
      const filteredUsers = response.data.filter(
        (user) => user.connection_status !== "tasdiqlashingiz_kutilmoqda"
      );
      setUsers(filteredUsers);
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

    // Update the connection_status for the specific user
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.user.id === userId ? { ...user, connection_status: "kutilmoqda" } : user
      )
    );
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 2);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  // Filter users to only show those with "kutilmoqda" status or no connection status
  const filteredUsers = users.filter(
    (user) => !user.connection_status || user.connection_status === "kutilmoqda"
  );

  const visibleUsers = filteredUsers.slice(0, visibleCount);
  const isEnd = visibleUsers.length >= filteredUsers.length;

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Balki tanishlaringiz</h2>
      <ul className="space-y-4">
        {visibleUsers.map((user) => (
          <li key={user.id} className="flex items-center gap-4 justify-between">
            <div className="flex items-center  space-x-3">
              <div
                onClick={() => handleUserClick(user.id)}
                className="flex items-center  space-x-3 cursor-pointer"
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
                <div>
                  <p className="font-semibold text-sm  hover:underline">
                    {user.full_name ? user.full_name.substring(0, 20) : ''}
                  </p>
                  {user.job_title && (
                    <p className="text-sm text-gray-500">{user.job_title}</p>
                  )}
                </div>
              </div>
            </div>
            {user.connection_status === "kutilmoqda" ? (
              <button
                className="border text-[12px] px-3 py-1 rounded-full border-gray-400 text-gray-500 cursor-not-allowed"
                disabled
              >
                Kutilmoqda
              </button>
            ) : (
              <button
                onClick={() => handleFollow(user.user.id)}
                className="border text-[12px] px-3 py-1 rounded-full border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                Ulanish +
              </button>
            )}
          </li>
        ))}
      </ul>

      {!isEnd && filteredUsers.length > 0 && (
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