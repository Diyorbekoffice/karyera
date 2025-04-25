import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function StorisMe() {
  const [profile, setProfile] = useState(null);
  const [myStories, setMyStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [loadingStates, setLoadingStates] = useState({
    delete: false,
    navigation: false
  });
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    // Fetch profile data
    axios.get('https://karyeraweb.pythonanywhere.com/api/profile/me', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setProfile(res.data);
    });

    // Fetch stories data
    axios.get('https://karyeraweb.pythonanywhere.com/api/profile/my_stories/', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setMyStories(res.data);
    });
  }, [token]);

  // Start timer for story progression
  const startTimer = () => {
    setProgress(0);
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timerRef.current);
          return 100;
        }
        return prev + (100 / (5 * 10)); // 5 seconds for progress (10ms interval)
      });
    }, 100);
  };

  // Stop timer
  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  // Handle modal open/close and story progression
  useEffect(() => {
    if (showModal && myStories.length > 0) {
      startTimer();
    } else {
      stopTimer();
      setCurrentStoryIndex(0);
      setProgress(0);
    }

    return () => {
      stopTimer();
    };
  }, [showModal]);

  // Handle automatic story progression
  useEffect(() => {
    if (progress >= 100) {
      stopTimer();
      
      if (currentStoryIndex < myStories.length - 1) {
        // Move to next story
        setCurrentStoryIndex(currentStoryIndex + 1);
      } else {
        // Close modal after last story (after 5 seconds)
        const timeout = setTimeout(() => {
          setShowModal(false);
        }, 5000);
        
        return () => clearTimeout(timeout);
      }
    }
  }, [progress]);

  // Start timer when current story changes
  useEffect(() => {
    if (showModal && myStories.length > 0) {
      startTimer();
    }
  }, [currentStoryIndex]);

  // Handle deleting a story
  const handleDeleteStory = (storyId) => {
    if (loadingStates.delete) return;

    setLoadingStates(prev => ({ ...prev, delete: true }));
    axios.delete(`https://karyeraweb.pythonanywhere.com/api/stories/${storyId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setMyStories(prev => prev.filter(story => story.id !== storyId));
      setShowModal(false);
    }).catch(err => {
      console.error(err.response?.data);
    }).finally(() => {
      setLoadingStates(prev => ({ ...prev, delete: false }));
    });
  };

  // Handle next/previous story navigation
  const handleNextStory = () => {
    stopTimer();
    if (currentStoryIndex < myStories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      setShowModal(false);
    }
  };

  const handlePrevStory = () => {
    stopTimer();
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  // Function to calculate time ago
  const timeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div className="p-4">
      {/* Profile image */}
      {profile && (
        <div className="relative inline-block">
          <img
            src={profile.profile_image}
            alt="Profile"
            className={`w-16 h-16 rounded-full border-4 ${myStories.length > 0 ? 'border-pink-500' : 'border-white'} ${myStories.length > 0 ? 'cursor-pointer' : 'cursor-default'}`}
            onClick={() => myStories.length > 0 && setShowModal(true)}
          />
        </div>
      )}

      {/* Story Modal */}
      {showModal && myStories.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative w-full max-w-md h-full max-h-[90vh]">
            {/* Progress bar for all stories */}
            <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
              {myStories.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1 flex-1 rounded-full ${index < currentStoryIndex ? 'bg-white' : index === currentStoryIndex ? 'bg-gray-500' : 'bg-gray-700'}`}
                >
                  {index === currentStoryIndex && (
                    <div 
                      className="h-full bg-white rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            {/* Story content */}
            <img
              src={myStories[currentStoryIndex].image}
              alt={myStories[currentStoryIndex].title}
              className="w-full h-full object-contain"
            />

            {/* Story info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
              <h3 className="text-xl font-bold">{myStories[currentStoryIndex].title}</h3>
              <div className="flex justify-between mt-2 text-sm">
                <span>👁️ {myStories[currentStoryIndex].views_count} views</span>
                <span>❤️ {myStories[currentStoryIndex].likes_count} likes</span>
                <span>🕒 {timeAgo(myStories[currentStoryIndex].created_at)}</span>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="absolute inset-0 flex">
              <div 
                className="w-1/2 h-full cursor-pointer"
                onClick={handlePrevStory}
              ></div>
              <div 
                className="w-1/2 h-full cursor-pointer"
                onClick={handleNextStory}
              ></div>
            </div>

            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white text-2xl z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            {/* Delete button */}
            <button
              className="absolute bottom-20 right-4 bg-red-500 text-white px-4 py-2 rounded-full z-10"
              onClick={() => handleDeleteStory(myStories[currentStoryIndex].id)}
              disabled={loadingStates.delete}
            >
              {loadingStates.delete ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      
      )}
      
    </div>
  );
}

export default StorisMe;