import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom'; 
import Recommendations from '../components/Recommendations';

function Friends() {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('/api/profile/connections/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFriends(response.data.results.connected_users);
            } catch (err) {
                setError("Do'stlar ro'yxatini olishda xato");
            } finally {
                setLoading(false);
            }
        };
        fetchFriends();
    }, []);

    const handleNavigate = (friendId) => {
        // Navigate to the profile page using the friend's id
        navigate(`/profile/${friendId}`);
    };

    if (loading) {
        return <div className="text-center text-lg">Yuklanmoqda...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div className="h-screen w-full bg-gray-100">
            <div className="w-full mx-auto p-6 ">
                <h2 className="text-3xl font-semibold mb-6">Do'stlar</h2>
                {friends.length === 0 ? (
                    <p className="text-center">Do'stlaringiz yo'q.</p>
                ) : (
                    <div className="flex flex-wrap gap-8 w-[650px]">
                        {friends.map((friend) => (
                            <div
                                key={friend.id}
                                className="bg-white rounded-lg shadow-xl p-6 transition-all duration-300 hover:shadow-2xl cursor-pointer w-[280px]"
                                onClick={() => handleNavigate(friend.id)} // Add onClick to navigate
                            >
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={friend.profile_image}
                                        alt={friend.full_name}
                                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-xl text-gray-800">{friend.full_name}</h3>
                                        <p className="text-sm text-gray-600">{friend.job}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Recommendations />
        </div>
    );
}

export default Friends;
