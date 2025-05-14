import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { FaRegComment, FaTrash, FaEdit } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { BsEmojiFrown } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

function CommentPost({ postId }) {
  const navigate = useNavigate();
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [showDelete, setShowDelete] = useState(null);

  const accessToken = localStorage.getItem('accessToken');
  const myId = localStorage.getItem('myId');

  // Kommentlar sonini olish
  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const response = await axios.get(
          `https://karyeraweb.pythonanywhere.com/api/posts/${postId}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setCommentCount(response.data.comment_count || 0);
      } catch (err) {
        console.error('Error fetching comment count:', err);
        setError('Komentariyalar sonini yuklab bo‘lmadi');
      } finally {
        setLoading(false);
      }
    };

    fetchCommentCount();
  }, [postId, accessToken]);

  // Modal ochilganda kommentlarni olish
  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `https://karyeraweb.pythonanywhere.com/api/post-comments/?post=${postId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setComments(response.data.results);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(
        `https://karyeraweb.pythonanywhere.com/api/post-comments/`,
        {
          post: postId,
          text: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setNewComment('');
      fetchComments();
      setCommentCount((prev) => prev + 1);
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleEditComment = async () => {
    if (!editText.trim()) return;

    try {
      await axios.patch(
        `https://karyeraweb.pythonanywhere.com/api/post-comments/${editingComment.id}/`,
        {
          text: editText,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setEditingComment(null);
      setEditText('');
      fetchComments();
    } catch (err) {
      console.error('Error editing comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `https://karyeraweb.pythonanywhere.com/api/post-comments/${commentId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      fetchComments();
      setCommentCount((prev) => prev - 1);
      setShowDelete(null);
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setEditingComment(null);
    setShowDelete(null);
  };

  const navigateToProfile = (userId) => {
const idmy = 'me'
navigate(userId === idmy ? `/profile/${idmy}` : `/profile/${userId}`);

    // navigate(userId === myId ? "/profile/me" : `/profile/${userId}`);
  };

  const isMyComment = (ownerId) => {
    return String(ownerId) === String(myId);
  };

  if (loading) {
    return (
      <button className="flex items-center">
        <FaRegComment className="text-2xl" />
        <span className="ml-1">...</span>
      </button>
    );
  }

  if (error) {
    return (
      <button className="flex items-center text-red-500">
        <FaRegComment className="text-2xl" />
        <span className="ml-1">!</span>
      </button>
    );
  }

  return (
    <>
      <button onClick={openModal} className="flex items-center">
        <FaRegComment className="text-2xl" />
        <span className="ml-1">{commentCount}</span>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-medium text-gray-900">
                    Komentariyalar ({commentCount})
                  </Dialog.Title>

                  <div className="mt-4 h-96 overflow-y-auto">
                    {comments.length > 0 ? (
                      comments.map((comment) => {
                        const isMine = isMyComment(comment.owner_info.id);
                        return (
                          <div
                            key={comment.id}
                            className={`mb-4 p-3 rounded-lg relative ${isMine ? 'bg-blue-50' : 'bg-gray-50'}`}
                            onMouseEnter={() => isMine && setShowDelete(comment.id)}
                            onMouseLeave={() => isMine && setShowDelete(null)}
                          >
                            <div
                              className="flex items-center cursor-pointer mb-2"
                              onClick={() => navigateToProfile(comment.owner_info.id)}
                            >
                              <img
                                src={comment.owner_info.profile_image || 'https://via.placeholder.com/40'}
                                alt={comment.owner_info.full_name}
                                className="w-8 h-8 rounded-full mr-2 object-cover"
                              />
                              <span className="font-semibold hover:text-blue-500">
                                {comment.owner_info.full_name}
                              </span>
                            </div>

                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                {editingComment?.id === comment.id ? (
                                  <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="w-full p-2 border rounded mt-1"
                                    autoFocus
                                  />
                                ) : (
                                  <p className="text-gray-700">{comment.text}</p>
                                )}
                              </div>
                              {isMine && showDelete === comment.id && (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => {
                                      setEditingComment(comment);
                                      setEditText(comment.text);
                                    }}
                                    className="text-gray-500 hover:text-blue-500"
                                  >
                                    <FaEdit className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="text-gray-500 hover:text-red-500"
                                  >
                                    <FaTrash className="h-5 w-5" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {editingComment?.id === comment.id && isMine && (
                              <div className="flex justify-end mt-2 space-x-2">
                                <button
                                  onClick={() => setEditingComment(null)}
                                  className="px-3 py-1 text-sm text-gray-600"
                                >
                                  Bekor qilish
                                </button>
                                <button
                                  onClick={handleEditComment}
                                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                                >
                                  Saqlash
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-10 text-gray-500">
                        <BsEmojiFrown className="mx-auto text-3xl mb-2" />
                        <p>Hozircha komentariyalar yo'q</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Komentariya yozing..."
                      className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <button
                      onClick={handleAddComment}
                      className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
                    >
                      <IoMdSend />
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default CommentPost;
