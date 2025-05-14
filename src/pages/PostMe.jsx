import React, { useState, useEffect } from 'react';
import instance from '../axios';
import { useNavigate } from 'react-router-dom';
import CommentPost from '../components/CommentPost';
import PostCreate from '../components/PostCreate';
import { MdDelete } from 'react-icons/md'; // React Iconsdan delete icon

const PostMe = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const accessToken = localStorage.getItem('accessToken');

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await instance.get('/api/profile/my_posts/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setError('Postlaringizni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            const liked = !post.is_liked;
            return {
              ...post,
              is_liked: liked,
              like_count: liked ? post.like_count + 1 : post.like_count - 1
            };
          }
          return post;
        })
      );

      await instance.post(`/api/posts/${postId}/like_post/`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (err) {
      console.error('Like xatoligi:', err);
    }
  };

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('Postni o‘chirmoqchimisiz?');
    if (!confirmDelete) return;

    try {
      await instance.delete(`/api/posts/${postId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Postni o‘chirishda xatolik:', err);
      alert('Postni o‘chirishda xatolik yuz berdi');
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-5">
        <div className="text-red-500 text-center py-10">{error}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto lg:w-[720px]">
      <div className='flex justify-between items-center'>
        <h1 className="text-2xl font-bold mb-6">Mening postlarim</h1>
        <PostCreate />
      </div>

      <div className="space-y-6 overflow-y-auto" style={{ maxHeight: '650px', overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none' }}>
        {posts.length > 0 ? (
          posts.map(post => (
            <div
              key={post.id}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm relative"
            >
              {/* Delete icon (React Icons) */}
              <button
                onClick={() => handleDelete(post.id)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                title="Postni o‘chirish"
              >
                <MdDelete size={24} />
              </button>

              <div className="flex items-center mb-4">
                <img
                  onClick={() => navigate(`/profile/me`)}
                  src={post.owner_info?.profile_image}
                  alt="Profile"
                  className="w-12 h-12 rounded-full mr-3 object-cover cursor-pointer"
                />
                <div
                  onClick={() => navigate(`/profile/me`)}
                  className='cursor-pointer'
                >
                  <h3 className="font-medium">{post.owner_info?.full_name}</h3>
                  <p className="text-gray-600 text-sm">{post.owner_info?.job}</p>
                </div>
              </div>

              {post.image && (
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full max-h-96 object-contain rounded mb-4"
                />
              )}

              <div className="mb-4">
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <h3 className="text-gray-700">{post.subtitle}</h3>
                <p className="mt-2 text-gray-800">{post.text}</p>
              </div>

              <div className="flex justify-between items-center text-sm">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex text-2xl items-center space-x-1 ${post.is_liked ? 'text-red-500 font-bold' : 'text-gray-500'}`}
                >
                  <span>{post.is_liked ? '❤️' : '🤍'}</span>
                  <span className='text-lg font-normal'>{post.like_count}</span>
                </button>
                <CommentPost postId={post.id} />
                <span className="text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        ) : (
          !loading && <div className="text-center py-10">Sizda hech qanday post mavjud emas</div>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-6">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default PostMe;
