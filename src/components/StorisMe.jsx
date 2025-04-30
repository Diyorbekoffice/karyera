import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaTimes } from 'react-icons/fa';

function StorisMe() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [myStories, setMyStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
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
      const now = new Date();
      const activeStories = res.data.filter(story => {
        const storyDate = new Date(story.created_at);
        const diffInHours = (now - storyDate) / (1000 * 60 * 60);
        return diffInHours < story.duration;
      });
      setMyStories(res.data);
      setFilteredStories(activeStories);
    });
  }, [token]);

  const startTimer = () => {
    setProgress(0);
    clearInterval(timerRef.current);

    const fixedDuration = 5;
    const intervalDuration = 100;
    const totalIntervals = (fixedDuration * 1000) / intervalDuration;
    const increment = 100 / totalIntervals;

    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timerRef.current);
          return 100;
        }
        return prev + increment;
      });
    }, intervalDuration);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (showModal && filteredStories.length > 0) {
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

  useEffect(() => {
    if (progress >= 100) {
      stopTimer();
      
      if (currentStoryIndex < filteredStories.length - 1) {
        setCurrentStoryIndex(currentStoryIndex + 1);
      } else {
        const timeout = setTimeout(() => {
          setShowModal(false);
        }, 500);
        
        return () => clearTimeout(timeout);
      }
    }
  }, [progress]);

  useEffect(() => {
    if (showModal && filteredStories.length > 0) {
      startTimer();
    }
  }, [currentStoryIndex]);

  const handleDeleteStory = (storyId) => {
    if (loadingStates.delete) return;

    setLoadingStates(prev => ({ ...prev, delete: true }));
    axios.delete(`https://karyeraweb.pythonanywhere.com/api/stories/${storyId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setMyStories(prev => prev.filter(story => story.id !== storyId));
      setFilteredStories(prev => prev.filter(story => story.id !== storyId));
      setShowModal(false);
    }).catch(err => {
      console.error(err.response?.data);
    }).finally(() => {
      setLoadingStates(prev => ({ ...prev, delete: false }));
    });
  };

  const handleNextStory = () => {
    stopTimer();
    if (currentStoryIndex < filteredStories.length - 1) {
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

  const handleProfileClick = () => {
    navigate(`/profile/${"me"}`);
  };

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
    <div className="">
      {profile && (
        <div className='flex flex-col'>
          <div className=" inline-block">
          {profile.profile_image ? (
            <img
              src={profile.profile_image}
              alt="Profile"
              className={` relative w-16 h-16 rounded-full border-4  ${filteredStories.length > 0 ? 'border-pink-500' : 'border-white'} ${filteredStories.length > 0 ? 'cursor-pointer' : 'cursor-default'}`}
              onClick={() => filteredStories.length > 0 && setShowModal(true)}
            />
          ) : (
            <div 
              className={`w-16 h-16 rounded-full border-4 ${filteredStories.length > 0 ? 'border-pink-500' : 'border-white'} ${filteredStories.length > 0 ? 'cursor-pointer' : 'cursor-default'} flex items-center justify-center bg-gray-200`}
              onClick={() => filteredStories.length > 0 && setShowModal(true)}
            >
              <FaUserCircle className="text-gray-500 text-4xl" />
            </div>
          )}
        </div >
        </div>
      )}

      {showModal && filteredStories.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative w-full max-w-md h-full max-h-[90vh]">
            <div 
              className="absolute top-4 left-4 z-10 flex items-center gap-2 cursor-pointer"
              onClick={handleProfileClick}
            >
              {filteredStories[currentStoryIndex].author.profile_image ? (
                <img
                  src={filteredStories[currentStoryIndex].author.profile_image}
                  alt={filteredStories[currentStoryIndex].author.full_name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                  <FaUserCircle className="text-gray-500 text-xl" />
                </div>
              )}
              <span className="text-white font-medium text-sm">
                {filteredStories[currentStoryIndex].author.full_name}
              </span>
            </div>

            <div className="absolute top-4 left-20 right-4 flex gap-1 z-10">
              {filteredStories.map((_, index) => (
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

            <img
              src={filteredStories[currentStoryIndex].image}
              alt={filteredStories[currentStoryIndex].title}
              className="w-full h-full object-contain"
            />

            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
              <h3 className="text-xl font-bold">{filteredStories[currentStoryIndex].title}</h3>
              <div className="flex justify-between mt-2 text-sm">
                <span>👁️ {filteredStories[currentStoryIndex].views_count} views</span>
                <span>❤️ {filteredStories[currentStoryIndex].likes_count} likes</span>
                <span>🕒 {timeAgo(filteredStories[currentStoryIndex].created_at)}</span>
              </div>
            </div>

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

            <button
              className="absolute top-4 right-4 text-white text-2xl z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
              onClick={() => setShowModal(false)}
            >
              <FaTimes />
            </button>

            <button
              className="absolute bottom-20 right-4 bg-red-500 text-white px-4 py-2 rounded-full z-10"
              onClick={() => handleDeleteStory(filteredStories[currentStoryIndex].id)}
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