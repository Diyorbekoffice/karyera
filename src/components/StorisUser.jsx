import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCircle, FaTimes, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function StoriesUser() {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [groupedStories, setGroupedStories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentAuthorStories, setCurrentAuthorStories] = useState([]);
  const [currentStoryDetails, setCurrentStoryDetails] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loadingStates, setLoadingStates] = useState({
    like: false,
    delete: false,
    view: false
  });

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('https://karyeraweb.pythonanywhere.com/api/stories/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setStories(response.data);
        groupStoriesByAuthor(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchStories();
  }, []);

  const groupStoriesByAuthor = (storiesData) => {
    const grouped = {};
    
    storiesData.forEach(story => {
      const authorId = story.author.id;
      if (!grouped[authorId]) {
        grouped[authorId] = [];
      }
      grouped[authorId].push(story);
    });
    
    setGroupedStories(grouped);
  };

  const fetchStoryDetails = async (storyId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `https://karyeraweb.pythonanywhere.com/api/stories/${storyId}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (err) {
      console.error('Error fetching story details:', err);
      return null;
    }
  };

  const handleStoryClick = async (authorId, storyIndex) => {
    const authorStories = groupedStories[authorId];
    setCurrentAuthorStories(authorStories);
    setCurrentStoryIndex(storyIndex);
    setShowModal(true);
    setProgress(0);
    
    const storyDetails = await fetchStoryDetails(authorStories[storyIndex].id);
    if (storyDetails) {
      setCurrentStoryDetails(storyDetails);
    }
    
    markStoryAsViewed(authorStories[storyIndex].id);
  };

  const markStoryAsViewed = async (storyId) => {
    try {
      setLoadingStates(prev => ({...prev, view: true}));
      const token = localStorage.getItem('accessToken');
      await axios.get(
        `https://karyeraweb.pythonanywhere.com/api/stories/${storyId}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setStories(prev => prev.map(story => 
        story.id === storyId 
          ? {...story, is_viewed: true, views_count: story.views_count + 1} 
          : story
      ));
      
      const updatedGrouped = {...groupedStories};
      for (const authorId in updatedGrouped) {
        updatedGrouped[authorId] = updatedGrouped[authorId].map(story => 
          story.id === storyId 
            ? {...story, is_viewed: true, views_count: story.views_count + 1} 
            : story
        );
      }
      setGroupedStories(updatedGrouped);
      
      if (currentStoryDetails && currentStoryDetails.id === storyId) {
        setCurrentStoryDetails(prev => ({
          ...prev,
          is_viewed: true,
          views_count: prev.views_count + 1
        }));
      }
    } catch (err) {
      console.error('Error marking story as viewed:', err);
    } finally {
      setLoadingStates(prev => ({...prev, view: false}));
    }
  };

  const handleLikeStory = async (storyId, isCurrentlyLiked) => {
    try {
      setLoadingStates(prev => ({...prev, like: true}));
      const token = localStorage.getItem('accessToken');
      
      await axios.post(
        `https://karyeraweb.pythonanywhere.com/api/stories/${storyId}/like_story/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const updatedStories = stories.map(story => {
        if (story.id === storyId) {
          return {
            ...story,
            is_liked: !isCurrentlyLiked,
            likes_count: isCurrentlyLiked ? story.likes_count - 1 : story.likes_count + 1
          };
        }
        return story;
      });
      
      setStories(updatedStories);
      
      setCurrentAuthorStories(prev => prev.map(story => {
        if (story.id === storyId) {
          return {
            ...story,
            is_liked: !isCurrentlyLiked,
            likes_count: isCurrentlyLiked ? story.likes_count - 1 : story.likes_count + 1
          };
        }
        return story;
      }));
      
      const updatedGrouped = {...groupedStories};
      for (const authorId in updatedGrouped) {
        updatedGrouped[authorId] = updatedGrouped[authorId].map(story => {
          if (story.id === storyId) {
            return {
              ...story,
              is_liked: !isCurrentlyLiked,
              likes_count: isCurrentlyLiked ? story.likes_count - 1 : story.likes_count + 1
            };
          }
          return story;
        });
      }
      setGroupedStories(updatedGrouped);
      
      if (currentStoryDetails && currentStoryDetails.id === storyId) {
        setCurrentStoryDetails(prev => ({
          ...prev,
          is_liked: !isCurrentlyLiked,
          likes_count: isCurrentlyLiked ? prev.likes_count - 1 : prev.likes_count + 1
        }));
      }
    } catch (err) {
      console.error('Error toggling story like:', err);
    } finally {
      setLoadingStates(prev => ({...prev, like: false}));
    }
  };

  const handleDeleteStory = async (storyId) => {
    try {
      setLoadingStates(prev => ({...prev, delete: true}));
      const token = localStorage.getItem('accessToken');
      await axios.delete(
        `https://karyeraweb.pythonanywhere.com/api/stories/${storyId}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setStories(prev => prev.filter(story => story.id !== storyId));
      
      const updatedGrouped = {...groupedStories};
      for (const authorId in updatedGrouped) {
        updatedGrouped[authorId] = updatedGrouped[authorId].filter(story => story.id !== storyId);
        if (updatedGrouped[authorId].length === 0) {
          delete updatedGrouped[authorId];
        }
      }
      setGroupedStories(updatedGrouped);
      
      if (currentAuthorStories.length === 1) {
        setShowModal(false);
      } else {
        const currentIndex = currentAuthorStories.findIndex(story => story.id === storyId);
        if (currentIndex >= 0) {
          const newIndex = currentIndex === currentAuthorStories.length - 1 ? currentIndex - 1 : currentIndex;
          setCurrentStoryIndex(newIndex);
          setCurrentAuthorStories(prev => prev.filter(story => story.id !== storyId));
        }
      }
    } catch (err) {
      console.error('Error deleting story:', err);
    } finally {
      setLoadingStates(prev => ({...prev, delete: false}));
    }
  };

  const handleNextStory = async () => {
    if (currentStoryIndex < currentAuthorStories.length - 1) {
      const nextIndex = currentStoryIndex + 1;
      setCurrentStoryIndex(nextIndex);
      setProgress(0);
      
      const storyDetails = await fetchStoryDetails(currentAuthorStories[nextIndex].id);
      if (storyDetails) {
        setCurrentStoryDetails(storyDetails);
      }
      
      markStoryAsViewed(currentAuthorStories[nextIndex].id);
    } else {
      setShowModal(false);
    }
  };

  const handlePrevStory = async () => {
    if (currentStoryIndex > 0) {
      const prevIndex = currentStoryIndex - 1;
      setCurrentStoryIndex(prevIndex);
      setProgress(0);
      
      const storyDetails = await fetchStoryDetails(currentAuthorStories[prevIndex].id);
      if (storyDetails) {
        setCurrentStoryDetails(storyDetails);
      }
    }
  };

  const handleProfileClick = () => {
    const id = currentAuthorStories[currentStoryIndex].author.id;
    navigate(`/profile/${id}`);
  };

  useEffect(() => {
    let interval;
    if (showModal && currentAuthorStories.length > 0) {
      const duration = (currentStoryDetails?.duration || 10) * 1000;
      const increment = 100 / (duration / 100);
      
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            handleNextStory();
            return 0;
          }
          return prev + increment;
        });
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [showModal, currentStoryIndex, currentAuthorStories, currentStoryDetails]);

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (loading) return <div className="text-center py-8">Loading stories...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (Object.keys(groupedStories).length === 0) return <div className="text-center py-8">No stories available</div>;

  return (
    <div className="ml-6">
      
      
      <div 
  className=" whitespace-nowrap overflow-x-auto overflow-y-hidden  max-w-[580px]"
  style={{
    scrollbarWidth: 'none',          // Firefox
    msOverflowStyle: 'none',         // IE/Edge
  }}
>
  <style>{`
    [class*="overflow-x-auto"]::-webkit-scrollbar {
      display: none;
    }
  `}</style>
     <div className="flex space-x-4 overflow-x-auto pb-4">
        {Object.entries(groupedStories).map(([authorId, authorStories]) => {
          const firstStory = authorStories[0];
          const hasUnviewed = authorStories.some(story => !story.is_viewed);
          
          return (
            <div 
              key={authorId} 
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleStoryClick(authorId, 0)}
            >
              <div className={`w-16 h-16 rounded-full p-1 ${hasUnviewed ? 'bg-gradient-to-tr from-yellow-400 to-pink-500' : 'bg-gray-200'}`}>
                {firstStory.author.profile_image ? (
                  <img
                    src={firstStory.author.profile_image}
                    alt={firstStory.author.full_name}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                    <FaUserCircle className="text-gray-400 text-3xl" />
                  </div>
                )}
              </div>
              <span className="text-xs mt-1 text-center truncate w-16">
                {firstStory.author.full_name.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
     </div>
      
      {showModal && currentAuthorStories.length > 0 && currentStoryDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative w-full max-w-md h-full max-h-[90vh]">
            {/* Author profile info */}
            <div 
              className="absolute top-4 left-4 z-10 flex items-center gap-2 cursor-pointer"
              onClick={handleProfileClick}
            >
              {currentStoryDetails.author.profile_image ? (
                <img
                  src={currentStoryDetails.author.profile_image}
                  alt={currentStoryDetails.author.full_name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                  <FaUserCircle className="text-gray-500 text-lg" />
                </div>
              )}
              <span className="text-white font-medium text-sm">
                {currentStoryDetails.author.full_name}
              </span>
            </div>

            {/* Progress bars */}
            <div className="absolute top-4 left-20 right-4 flex gap-1 z-10">
              {currentAuthorStories.map((_, index) => (
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
            {currentStoryDetails.image && (
              <img
                src={currentStoryDetails.image}
                alt={currentStoryDetails.title}
                className="w-full h-full object-contain"
              />
            )}

            {/* Story info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
              <h3 className="text-xl font-bold">{currentStoryDetails.title}</h3>
              <div className="flex justify-between mt-2 text-sm">
                <span>👁️ {currentStoryDetails.views_count} views</span>
                <span>❤️ {currentStoryDetails.likes_count} likes</span>
                <span>🕒 {timeAgo(currentStoryDetails.created_at)}</span>
              </div>
            </div>

            {/* Navigation areas */}
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
              className="absolute top-4 right-4 text-white z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
              onClick={() => setShowModal(false)}
            >
              <FaTimes className="text-xl" />
            </button>

            {/* Like button */}
            <button
              className="absolute bottom-20 right-4 z-10"
              onClick={() => handleLikeStory(
                currentStoryDetails.id,
                currentStoryDetails.is_liked
              )}
              disabled={loadingStates.like}
            >
              {currentStoryDetails.is_liked ? (
                <FaHeart className="text-red-500 text-3xl" />
              ) : (
                <FaRegHeart className="text-white text-3xl" />
              )}
            </button>

            {/* Delete button */}
            {currentStoryDetails.is_author && (
              <button
                className="absolute bottom-32 right-4 bg-red-500 text-white px-4 py-2 rounded-full z-10"
                onClick={() => handleDeleteStory(currentStoryDetails.id)}
                disabled={loadingStates.delete}
              >
                {loadingStates.delete ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StoriesUser;