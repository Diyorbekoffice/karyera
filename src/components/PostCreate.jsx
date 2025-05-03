import React, { useState } from 'react';
import { FaRegFileAlt } from 'react-icons/fa';
import axios from '../axios'; // Adjust the import path

function PostCreate() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    text: '',
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      alert('Sarlavha majburiy!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('accessToken'); // Assuming you store token in localStorage
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subtitle', formData.subtitle || null);
      formDataToSend.append('text', formData.text || null);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await axios.post('/api/posts/', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        setSuccessMessage('Post muvaffaqiyatli joylandi!');
        setFormData({
          title: '',
          subtitle: '',
          text: '',
          image: null
        });
        setTimeout(() => {
          setSuccessMessage('');
          setIsModalOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Xatolik yuz berdi:', error);
      alert('Post joylashda xatolik yuz berdi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-[10px] py-[2px] rounded-md bg-white shadow  hover:bg-gray-100 transition "
        >
          <span className='text-3xl'>+</span>
          <span>Post yaratish</span>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Yangi Post</h2>
              
              {successMessage && (
                <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="title">
                    Sarlavha *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="subtitle">
                    Ostki sarlavha
                  </label>
                  <input
                    type="text"
                    id="subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="text">
                    Matn
                  </label>
                  <textarea
                    id="text"
                    name="text"
                    value={formData.text}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows="4"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="image">
                    Rasm
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded"
                    accept="image/*"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    disabled={isSubmitting}
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Yuborilmoqda...' : 'Yuborish'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCreate;