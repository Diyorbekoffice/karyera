import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../assets/logo.svg';
import Recommendations from "../components/Recommendations";
import {
  FaUserCircle, FaSignOutAlt, FaHome, FaUsers, FaPlusSquare,
  FaInbox, FaSearch, FaBell, FaCogs, FaLink 
} from 'react-icons/fa';
import { IoChatbubbleEllipsesSharp } from 'react-icons/io5';
import Create from '../components/Create';
import StorisMe from '../components/StorisMe';

function Layout() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const toggleSelect = () => setIsSelectOpen(!isSelectOpen);
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };
  const handleLogoClick = () => navigate('/');
  const handleProfileClick = () => navigate(`/profile/me`);
  const toggleCreate = () => setShowCreate(!showCreate);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return setLoading(false);

        const response = await axios.get(
          "https://karyeraweb.pythonanywhere.com/api/profile/me/",
          {
            headers: { Authorization: `Bearer ${token}` },
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



  return (
    <div className="flex w-full bg-gray-100 ">



      {/* Main */}
      <div className="flex-1 bg">
        {/* Header */}
        <header className="bg-white shadow p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Logo */}
            <div className="flex items-center gap-1 cursor-pointer" onClick={handleLogoClick}>
              <img src={logo} alt="logo" className="w-8 h-8" />
              <span className="font-bold text-[20px]">Karyera</span>
            </div>

            {/* Search Input */}
            <div className="flex-1 mx-4 max-w-md">
              <input
                type="text"
                placeholder="Qidirish..."
                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Profile Info */}
            <div className="flex items-center gap-3">
              {loading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-gray-200 h-8 w-8"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              ) : profile ? (
                <div className="relative flex items-center gap-2">
                  {profile.profile_image ? (
                    <img
                      src={profile.profile_image}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover cursor-pointer"
                      onClick={handleProfileClick}
                    />
                  ) : (
                    <FaUserCircle
                      className="w-8 h-8 text-gray-500 cursor-pointer"
                      onClick={handleProfileClick}
                    />
                  )}
                  <div className="text-sm font-medium cursor-pointer" onClick={toggleSelect}>
                    {profile.full_name}
                  </div>
                  {isSelectOpen && (
                    <div className="absolute top-10 right-0 bg-white shadow rounded p-2 z-50">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-600 hover:bg-gray-100 px-3 py-2 w-full"
                      >
                        <FaSignOutAlt /> Chiqish
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Kirish
                </button>
              )}

            </div>
          </div>
        </header>

        {/* Create Modal */}
        {showCreate && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50">
            <Create />
          </div>
        )}

        <div className='flex mt-1 max-w-[1440px] mx-auto justify-between'>
          <div className='flex'>
            <aside className="w-[350px] bg-white h-[500px] rounded-xl shadow-md flex flex-col p-4 ">


              {/* User Card */}
              <div className="bg-gray-50  rounded-xl shadow-sm  py-3 mb-8">
                <div className="flex items-center gap-2 m-2">
                  <div className=''>
                    <StorisMe />
                  </div>
                  <div>
                    <h4 onClick={handleProfileClick} className="font-semibold text-lg cursor-pointer">{profile?.full_name || 'Foydalanuvchi'}</h4>
                    <p onClick={handleProfileClick} className="text-xs text-gray-500 cursor-pointer">{profile?.bio}</p>
                  </div>
                </div>
                <div className='flex justify-center gap-12'>
                  <div className='flex flex-col items-center font-bold'>
                    {profile?.connections_count} <span> do'stlar</span>
                  </div>
                  <div className='flex flex-col items-center font-bold'>
                    {profile?.post_count} <span>postlar</span>
                  </div>
                </div>
              </div>



              {/* Menu */}
              <nav className="flex flex-col gap-4 text-gray-700">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? "bg-blue-100 text-blue-600" : "hover:text-blue-600"
                    }`
                  }
                >
                  <FaHome /> Bosh sahifa
                </NavLink>

                <NavLink
                  to="/chat"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? "bg-blue-100 text-blue-600" : "hover:text-blue-600"
                    }`
                  }
                >
                  <IoChatbubbleEllipsesSharp /> Chatlar
                </NavLink>

                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? "bg-blue-100 text-blue-600" : "hover:text-blue-600"
                    }`
                  }
                >
                  <FaUsers /> Do‘stlar
                </NavLink>

                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-md ${isActive ? "bg-blue-100 text-blue-600" : "hover:text-blue-600"
                    }`
                  }
                >
                  <FaLink  /> Ulanishlar
                </NavLink>
              </nav>

            </aside>
            <div>
              <main className="p-6">
                <Outlet />
              </main>
            </div>
          </div>
          <div>
            <Recommendations />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
