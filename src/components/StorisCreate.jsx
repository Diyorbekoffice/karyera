import React, { useState, useEffect } from 'react';

function StorisCreate() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image: null,
    duration: 6
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeStoriesCount, setActiveStoriesCount] = useState(0);
  const [limitReachedModal, setLimitReachedModal] = useState(false);

  // Check active stories count when component mounts
  useEffect(() => {
    const checkActiveStories = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const response = await fetch('https://karyeraweb.pythonanywhere.com/api/profile/my_stories/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const now = new Date();
          const activeCount = data.filter(story => {
            const storyDate = new Date(story.created_at);
            const diffInHours = (now - storyDate) / (1000 * 60 * 60);
            return diffInHours < story.duration;
          }).length;
          setActiveStoriesCount(activeCount);
        }
      } catch (err) {
        console.error('Error fetching active stories:', err);
      }
    };

    checkActiveStories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeStoriesCount >= 3) {
      setError('You can only have 3 active stories at a time');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const data = new FormData();
      data.append('title', formData.title);
      data.append('duration', formData.duration);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await fetch('https://karyeraweb.pythonanywhere.com/api/stories/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create story');
      }

      setSuccess(true);
      setActiveStoriesCount(prev => prev + 1);

      setTimeout(() => {
        setIsModalOpen(false);
        setFormData({
          title: '',
          image: null,
          duration: 6
        });
      }, 5);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={() => {
          if (activeStoriesCount >= 3) {
            setLimitReachedModal(true);
          } else {
            setIsModalOpen(true);
            setError(null);
            setSuccess(false);
          }
        }}
        className="bg-blue-500  text-white w-5 h-5 flex justify-center items-center rounded-full  hover:bg-blue-600 transition"
      >
        +
      </button>

      {/* Limit reached modal */}
      {limitReachedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Limit reached</h2>
            <p className="text-gray-700 mb-6">
              Bir kunda faqat 3 ta story joylash mumkin. Iltimos, avval eski story'laringizni o'chirib tashlang yoki kuting.
            </p>
            <button
              onClick={() => setLimitReachedModal(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Yopish
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Story</h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setError(null);
                  setSuccess(false);
                }}
                className="text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="image">
                  Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded"
                  accept="image/*"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <div className="flex gap-4">
                  {[6, 12, 24].map((duration) => (
                    <label key={duration} className="flex items-center">
                      <input
                        type="radio"
                        name="duration"
                        value={duration}
                        checked={formData.duration === duration}
                        onChange={() => setFormData({...formData, duration})}
                        className="mr-2"
                        disabled={isLoading}
                      />
                      {duration} hours
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-4 text-red-500 text-sm">{error}</div>
              )}

              

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setError(null);
                    setSuccess(false);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  disabled={isLoading || activeStoriesCount >= 3}
                >
                  {isLoading ? 'Uploading...' : 'Create Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StorisCreate;
