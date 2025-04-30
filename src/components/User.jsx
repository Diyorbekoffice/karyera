import React, { useEffect } from 'react'
import StorisMe from './StorisMe';
import StorisCreate from './StorisCreate';

function User() {
    useEffect (() => {
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
    })
  return (
    <div className='flex flex-col items-center' >
      <div className='relative '>
      <div>
      <StorisMe />
      </div>
      <div className='absolute right-0 top-11 border-[3px] rounded-full border-[#f3f3f3] '>
      <StorisCreate />
      </div>
    </div>
    <span className=' text-[12px]'>Mening hikoyam </span>
    </div>
  )
}

export default User