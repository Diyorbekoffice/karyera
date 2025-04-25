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
    <div>
      <StorisMe />
      <StorisCreate />
    </div>
  )
}

export default User