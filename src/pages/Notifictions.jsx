import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { FaUser } from 'react-icons/fa';
import { FaCheck, FaTimes } from 'react-icons/fa';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('/api/follow-user-to-user/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(response.data.results);
      } catch (err) {
        setError("Bildirishnomalarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleApprove = async (id) => {
    const token = localStorage.getItem('accessToken');
    await axios.post(
      `/api/follow-user-to-user/${id}/approve/`, 
      {}, // body bo'sh bo'lishi mumkin
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setNotifications(notifications.filter((n) => n.id !== id));
  };
  

  const handleReject = async (id) => {
    const token = localStorage.getItem('accessToken');
    await axios.delete(`/api/follow-user-to-user/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  if (loading) return <div className="text-center text-lg">Yuklanmoqda...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Bildirishnomalar</h2>
      {notifications.length === 0 ? (
        <p className="text-center">Bildirishnomalar yo‘q.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center">
                {notif.sender_profile.profile_image ? (
                  <img
                    src={notif.sender_profile.profile_image}
                    alt={notif.sender_profile.full_name}
                    className="w-14 h-14 rounded-full object-cover border mr-4"
                  />
                ) : (
                  <div className="w-14 h-14 flex items-center justify-center bg-gray-200 rounded-full mr-4">
                    <FaUser className="text-gray-500 text-xl" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-800">
                    <span className="text-blue-600">{notif.sender_profile.full_name}</span> sizni do‘stlikka qo‘shmoqchi
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(notif.created).toLocaleString('uz-UZ')}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 ml-24">
                <button
                  onClick={() => handleApprove(notif.id)}
                  className="text-green-600 hover:text-green-800"
                  title="Qabul qilish"
                >
                  <FaCheck size={20} />
                </button>
                <button
                  onClick={() => handleReject(notif.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Rad etish"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;
