import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.svg';
import { FaUserCircle, FaSignOutAlt, FaHome, FaUsers, FaPlusSquare, FaInbox } from 'react-icons/fa';
import { IoChatbubbleEllipsesSharp } from 'react-icons/io5'; // chat uchun

function Layout() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const toggleSelect = () => {
    setIsSelectOpen(!isSelectOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "https://karyeraweb.pythonanywhere.com/api/profile/me/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('accessToken');
          navigate('/login');
        }
        setError(err.message || 'Profil ma\'lumotlarini yuklashda xato');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    const userID = "me"
    navigate(`/profile/${userID}`);  // Masalan: `/profile/123`
  };

  return (
    <div className=" ">
      <div className='bg-white shadow-md'>
      <header className="flex justify-between py-4   max-w-[1240px] mx-auto">
        {/* logo */}
        <div
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleLogoClick}
        >
          <img src={logo} alt="logo" className="w-[40px] h-[40px]" />
          <span className="font-bold text-2xl ml-2">Karyera</span>
        </div>

        {/* navbar */}
        <nav className="flex justify-center gap-12 py-4 ">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-2xl ${isActive ? 'text-blue-600 underline' : 'text-gray-600 hover:text-blue-600 '}`
            }
          >
            <FaHome />
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              `text-2xl ${isActive ? 'text-blue-600 underline' : 'text-gray-600 hover:text-blue-600'}`
            }
          >
            <FaUsers />
          </NavLink>

          <NavLink
            to="/create"
            className={({ isActive }) =>
              `text-2xl ${isActive ? 'text-blue-600 underline' : 'text-gray-600 hover:text-blue-600'}`
            }
          >
            <FaPlusSquare />
          </NavLink>

          <NavLink
            to="/chat"
            className={({ isActive }) =>
              `text-2xl ${isActive ? 'text-blue-600 underline' : 'text-gray-600 hover:text-blue-600'}`
            }
          >
            <IoChatbubbleEllipsesSharp />
          </NavLink>

          <NavLink
            to="/inbox"
            className={({ isActive }) =>
              `text-2xl ${isActive ? 'text-blue-600 underline' : 'text-gray-600 hover:text-blue-600'}`
            }
          >
            <FaInbox />
          </NavLink>
        </nav>

        {/* profile */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-8 w-8"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-sm">{error}</div>
          ) : profile ? (
            <div className="relative flex items-center gap-2">
              <div onClick={handleProfileClick}>
              {profile.profile_image ? (
                <img
                  
                  src={profile.profile_image}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover cursor-pointer"
                />
              ) : (
                <FaUserCircle className="text-gray-400 text-2xl" />
              )}
              </div>

              <div className="flex items-center space-x-2 relative">
                <div
                  className="text-gray-800 cursor-pointer"
                  onClick={toggleSelect}
                >
                  {profile.full_name || 'Foydalanuvchi'}
                </div>

                {isSelectOpen && (
                  <div className="absolute top-5 right-0 bg-white shadow-lg rounded py-2 z-50 w-40">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors"
                    >
                      <FaSignOutAlt className="text-red-600" />
                      Chiqish
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => navigate('/login')}
            >
              Kirish
            </button>
          )}
        </div>
      </header>
      </div>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
