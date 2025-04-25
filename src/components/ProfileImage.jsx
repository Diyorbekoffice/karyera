import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle, FaCamera, FaTrash, FaBriefcase, FaGraduationCap, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import { RotateLoader } from 'react-spinners';
import ProfileEdit from './ProfileEdit';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ProfileHeader = ({ userId }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [realUserId, setRealUserId] = useState(null);
  const [fullName, setFullname] = useState(null);
  const [connection, setConnection] = useState(null);
  const [post, setPost] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loadingType, setLoadingType] = useState(null);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [currentImageType, setCurrentImageType] = useState(null);
  const [showBackImageUpload, setShowBackImageUpload] = useState(false);
  const [userDetails, setUserDetails] = useState({
    jobcategory: null,
    job: null,
    region: null,
    territory: null,
    eduarea: null,
    subeduarea: null,
    bio: null
  });
  const [showFullBio, setShowFullBio] = useState(false);

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `https://karyeraweb.pythonanywhere.com/api/profile/${userId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfileImage(res.data.profile_image);
        setBackImage(res.data.profile_back_image);
        setFullname(res.data.full_name);
        setConnection(res.data.connections_count);
        setPost(res.data.post_count);

        setUserDetails({
          jobcategory: res.data.jobcategory,
          job: res.data.job,
          region: res.data.region,
          territory: res.data.territory,
          eduarea: res.data.eduarea,
          subeduarea: res.data.subeduarea,
          bio: res.data.bio
        });

        if (userId === 'me') {
          setRealUserId(res.data.id);
          setIsOwner(true);
        } else {
          setRealUserId(userId);
          setIsOwner(false);
        }
      } catch (err) {
        setError('Failed to load profile data');
      }
    }

    fetchData();
  }, [userId, token]);

  const handleImageUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setError('Iltimos, rasm faylini tanlang');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Rasm hajmi 5MB dan kichik boʻlishi kerak');
      return;
    }

    setLoadingType(type);
    setError(null);

    try {
      const formData = new FormData();
      formData.append(type, file);

      const res = await axios.patch(
        `https://karyeraweb.pythonanywhere.com/api/profile/${realUserId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (type === 'profile_image') {
        setProfileImage(res.data.profile_image);
      } else if (type === 'profile_back_image') {
        setBackImage(res.data.profile_back_image);
      }
      setShowBackImageUpload(false);
    } catch (err) {
      setError('Rasmni yuklashda xatolik yuz berdi');
    } finally {
      setLoadingType(null);
      event.target.value = '';
    }
  };

  const handleDeleteImage = async (type) => {
    try {
      setLoadingType(type);
      setError(null);

      await axios.patch(
        `https://karyeraweb.pythonanywhere.com/api/profile/${realUserId}/`,
        { [type]: null },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (type === 'profile_image') {
        setProfileImage(null);
      } else if (type === 'profile_back_image') {
        setBackImage(null);
      }

      setModalIsOpen(false);
    } catch (err) {
      setError('Rasmni o\'chirishda xatolik yuz berdi');
    } finally {
      setLoadingType(null);
    }
  };

  const openImageModal = (imageUrl, type) => {
    setModalImage(imageUrl);
    setCurrentImageType(type);
    setModalIsOpen(true);
  };

  const handleImageClick = (type, currentImage) => {
    if (currentImage) {
      openImageModal(currentImage, type);
    } else if (isOwner && type === 'profile_back_image') {
      setShowBackImageUpload(true);
    }
  };

  const handleBackImageClick = () => {
    if (backImage) {
      openImageModal(backImage, 'profile_back_image');
    } else if (isOwner) {
      setShowBackImageUpload(true);
    }
  };

  const toggleBio = () => {
    setShowFullBio(!showFullBio);
  };

  const renderDetail = (icon, value, fallback = "Ko'rsatilmagan") => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-2 text-gray-700">
        {icon}
        <span>{value}</span>
      </div>
    );
  };

  return (
    <div className="relative w-full mb-16">
      {/* Background Image */}
      <div
        className="h-96 w-full relative rounded-b-xl bg-gradient-to-r from-gray-400 to-gray-600 cursor-pointer"
        style={{
          backgroundImage: backImage ? `url(${backImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        onClick={handleBackImageClick}
      >
        {loadingType === 'profile_back_image' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <RotateLoader color="#ffffff" size={15} />
          </div>
        )}

        {(!backImage || showBackImageUpload) && isOwner && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="text-white text-center p-4">
              <label htmlFor="backImageUpload" className="cursor-pointer">
                <FaCamera className="mx-auto text-4xl mb-2" />
                <p>Cover rasmini yuklash</p>
                <input
                  id="backImageUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'profile_back_image')}
                  className="hidden"
                  disabled={!!loadingType}
                />
              </label>
              {backImage && showBackImageUpload && (
                <button
                  onClick={() => setShowBackImageUpload(false)}
                  className="mt-4 px-4 py-2 bg-white text-gray-800 rounded-md"
                >
                  Bekor qilish
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile Picture and Info */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start -mt-16 left-12 relative">
          <div className="relative">
            <div
              className="w-48 h-48 rounded-full border-8 border-[#f3f3f3] overflow-hidden bg-white cursor-pointer"
              onClick={() => handleImageClick('profile_image', profileImage)}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <FaUserCircle className="w-3/4 h-3/4 text-gray-400" />
                </div>
              )}

              {loadingType === 'profile_image' && (
                <div className="absolute inset-0 bg-white rounded-full bg-opacity-50 flex items-center justify-center">
                  <RotateLoader color="#000" size={10} />
                </div>
              )}

              {!profileImage && isOwner && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
                  <div className="text-white text-center p-4">
                    <label htmlFor="profileImageUpload" className="cursor-pointer">
                      <FaCamera className="mx-auto text-2xl mb-1" />
                      <p className="text-xs">Rasm yuklash</p>
                      <input
                        id="profileImageUpload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'profile_image')}
                        className="hidden"
                        disabled={!!loadingType}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {isOwner && profileImage && (
              <div className="absolute bottom-4 right-4 flex gap-2">
                <label
                  htmlFor="profileImageUpload"
                  className="bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition"
                  title="Profil rasmini o'zgartirish"
                >
                  <FaCamera className="text-gray-700 text-lg" />
                  <input
                    id="profileImageUpload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'profile_image')}
                    className="hidden"
                    disabled={!!loadingType}
                  />
                </label>
              </div>
            )}
          </div>

          <div className='flex flex-col md:flex-row items-start md:items-center justify-between w-full'>
            <div className='ml-5 mt-18 flex flex-col gap-2 w-full'>
              <h1 className='text-4xl md:text-5xl font-semibold'>{fullName}</h1>
              
              {/* User details section */}
              <div className=" flex gap-12 w-full items-start">
                <div className="space-y-2">
                  {renderDetail(<FaBriefcase className="text-gray-500" />, userDetails.job)}
                  {renderDetail(<FaGraduationCap className="text-gray-500" />, 
                    userDetails.eduarea && userDetails.subeduarea 
                      ? `${userDetails.eduarea} (${userDetails.subeduarea})` 
                      : userDetails.eduarea)}
                  {renderDetail(<FaMapMarkerAlt className="text-gray-500" />, 
                    userDetails.region && userDetails.territory 
                      ? `${userDetails.region}, ${userDetails.territory}` 
                      : userDetails.region)}
                </div>
                
                {userDetails.bio && (
                  <div className="flex items-start gap-2">
                    <div className="">
                      <h3 className="font-semibold text-gray-700">Bio: </h3>
                      
                    </div>
                    <p className={` text-gray-600 ${!showFullBio && 'line-clamp-3'}`}>
                      {userDetails.bio}
                    </p>
                    {userDetails.bio.length > 150 && (
                      <button 
                        onClick={toggleBio}
                        className="text-blue-500 hover:text-blue-700 text-sm mt-1"
                      >
                        {showFullBio ? 'Kamroq ko\'rsatish' : 'Batafsil...'}
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              
            </div>
            
            
            {isOwner && (
              <div className='mt-4 mr-8'>
                <ProfileEdit userData={realUserId} />
              </div>
            )}
          </div>
          
        </div>
        <div className='flex gap-8 mt-4 ml-14'>
                <a href="#" className="hover:underline">
                  <span className='font-semibold'>{connection}</span> do'stlar
                </a>
                <a href="#" className="hover:underline">
                  <span className='font-semibold'>{post}</span> postlar
                </a>
              </div>
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Image Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="relative max-w-4xl max-h-screen">
          <button
            onClick={() => setModalIsOpen(false)}
            className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300"
          >
            &times;
          </button>
          <img
            src={modalImage}
            alt="Full size"
            className="max-w-full max-h-[90vh] object-contain"
          />
          {isOwner && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              <label
                htmlFor={`modal${currentImageType}Upload`}
                className="bg-white p-2 rounded-md shadow-md cursor-pointer hover:bg-gray-100 transition"
              >
                <FaCamera className="inline mr-2" />
                Yuklash
                <input
                  id={`modal${currentImageType}Upload`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleImageUpload(e, currentImageType);
                    setModalIsOpen(false);
                  }}
                  className="hidden"
                  disabled={!!loadingType}
                />
              </label>
              <button
                onClick={() => handleDeleteImage(currentImageType)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center"
              >
                <FaTrash className="inline mr-2" />
                O'chirish
              </button>
            </div>
          )}
        </div>
      </Modal>

      {/* Error Message */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
          {error}
        </div>
      )}

      {/* Modal styles */}
      <style jsx global>{`
        .modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: transparent;
          padding: 0;
          border: none;
          outline: none;
          max-width: 90vw;
          max-height: 90vh;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.75);
          z-index: 1000;
        }
      `}</style>
    </div>
  );
};

export default ProfileHeader;