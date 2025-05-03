import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CommentPost from './CommentPost';
import { useNavigate } from 'react-router-dom';
import PostCreate from './PostCreate';

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const observer = useRef();
  const accessToken = localStorage.getItem('accessToken');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`https://karyeraweb.pythonanywhere.com/api/posts/?page=${page}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      const newPosts = response.data?.results || [];
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      
      if (!response.data.next) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Postlarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      // Optimistik yangilash (UI ni darhol o'zgartirish)
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            const newLikeStatus = !post.is_liked;
            return {
              ...post,
              is_liked: newLikeStatus,
              like_count: newLikeStatus ? post.like_count + 1 : post.like_count - 1
            };
          }
          return post;
        })
      );

      // APIga so'rov yuborish
      await axios.post(
        `https://karyeraweb.pythonanywhere.com/api/posts/${postId}/like_post/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

    } catch (error) {
      console.error('Error liking post:', error);
      
      // Agar xatolik bo'lsa, oldingi holatga qaytarish
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              is_liked: post.is_liked, // Oldingi holatni qaytarish
              like_count: post.like_count // Oldingi holatni qaytarish
            };
          }
          return post;
        })
      );
    }
  };

  const lastPostRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

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
      <h1 className="text-2xl font-bold mb-6">Postlar</h1>
      <PostCreate />
      </div>
      
      <div className="space-y-6 overflow-y-auto" style={{ maxHeight: '550px' }}>
        {posts.length > 0 ? (
          posts.map((post, index) => {
            const isLastPost = posts.length === index + 1;
            return (
              <div 
                ref={isLastPost ? lastPostRef : null}
                key={post.id} 
                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <img 
                  onClick={() => navigate(`/profile/${post.owner_info.id}`)}
                    src={post.owner_info?.profile_image} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full mr-3 object-cover cursor-pointer"
                  />
                  <div onClick={() => navigate(`/profile/${post.owner_info.id}`)} className='cursor-pointer'>
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
            );
          })
        ) : (
          !loading && <div className="text-center py-10">Postlar topilmadi</div>
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

export default Posts;