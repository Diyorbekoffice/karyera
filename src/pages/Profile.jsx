import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import ProfileImage from '../components/ProfileImage';

function Profile() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(
          `https://karyeraweb.pythonanywhere.com/api/profile/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setUserData(response.data.id);
        
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

 


  return (
    <div className='max-w-[1240px] mx-auto'>
      <ProfileImage userId={userId} />
      
      
    </div>
  );
}

export default Profile;