import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle, FaTimes } from 'react-icons/fa';

function StorisList() {
  const [stories, setStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loadingStates, setLoadingStates] = useState({ delete: false });

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    axios.get('https://karyeraweb.pythonanywhere.com/api/profile/my_stories/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => setStories(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (showModal) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleNextStory();
            return 0;
          }
          return prev + 1;
        });
      }, 120);

      return () => clearInterval(timer);
    }
  }, [showModal, currentStoryIndex]);

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
    }
  };

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
    } else {
      setShowModal(false);
      setProgress(0);
    }
  };

  const handleProfileClick = () => {
    const username = stories[currentStoryIndex].author.user.username;
    window.location.href = `/profile/${username}`;
  };

  const handleDeleteStory = (id) => {
    setLoadingStates({ delete: true });
    axios.delete(`https://karyeraweb.pythonanywhere.com/api/stories/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setStories(prev => prev.filter(story => story.id !== id));
        setShowModal(false);
        setLoadingStates({ delete: false });
      })
      .catch(() => setLoadingStates({ delete: false }));
  };

  const timeAgo = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diff = Math.floor((now - created) / 1000);
    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className='max-h-[250px] overflow-y-auto'>
       
      <div className="grid grid-cols-2 gap-4 p-4 ">
        {stories.map((story, idx) => (
          <div 
            key={story.id} 
            className="cursor-pointer" 
            onClick={() => { setCurrentStoryIndex(idx); setShowModal(true); }}
          >
            <img src={story.image} alt={story.title} className="w-full h-40 object-cover rounded-lg" />
            <p className="mt-2 font-semibold">{story.title}</p>
          </div>
        ))}
      </div>

      {showModal && stories.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative w-full max-w-md h-full max-h-[90vh]">
            <div 
              className="absolute top-4 left-4 z-10 flex items-center gap-2 cursor-pointer"
              onClick={handleProfileClick}
            >
              {stories[currentStoryIndex].author.profile_image ? (
                <img
                  src={stories[currentStoryIndex].author.profile_image}
                  alt={stories[currentStoryIndex].author.full_name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                  <FaUserCircle className="text-gray-500 text-xl" />
                </div>
              )}
              <span className="text-white font-medium text-sm">
                {stories[currentStoryIndex].author.full_name}
              </span>
            </div>

            <div className="absolute top-4 left-20 right-4 flex gap-1 z-10">
              {stories.map((_, index) => (
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
              src={stories[currentStoryIndex].image}
              alt={stories[currentStoryIndex].title}
              className="w-full h-full object-contain"
            />

            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
              <h3 className="text-xl font-bold">{stories[currentStoryIndex].title}</h3>
              <div className="flex justify-between mt-2 text-sm">
                <span>👁️ {stories[currentStoryIndex].views_count} views</span>
                <span>❤️ {stories[currentStoryIndex].likes_count} likes</span>
                <span>🕒 {timeAgo(stories[currentStoryIndex].created_at)}</span>
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
              onClick={() => handleDeleteStory(stories[currentStoryIndex].id)}
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

export default StorisList;
