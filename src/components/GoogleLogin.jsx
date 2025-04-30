import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../axios';
import { useNavigate } from 'react-router-dom';
import googleIcon from '../assets/google.svg'; // Make sure to have this asset

const GoogleRegister = () => {
  const divRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: '739702533994-u5g9cn098irnfskmf2rdf2o3io75k9h3.apps.googleusercontent.com',
          callback: handleCredentialResponse,
        });
        window.google.accounts.id.renderButton(divRef.current, {
          type: 'icon',
          shape: 'circle',
          theme: 'filled_blue',
          size: 'medium',
        });
      };
      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  const handleCredentialResponse = async (response) => {
    setLoading(true);
    const decoded = JSON.parse(atob(response.credential.split('.')[1]));
    const email = decoded.email;
    const full_name = `${decoded.given_name} ${decoded.family_name}`;

    try {
      const res = await axiosInstance.post('/user/auth_google/signin/', {
        email,
        full_name,
      });

      if (res.status === 200) {
        const accessToken = res.data.tokens.access;
        const userData = {
          full_name: full_name,
          user: {
            email: email,
          },
        };

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userData', JSON.stringify(userData));

        alert(res.data?.message || 'Muvaffaqiyatli kirildi!');
        navigate('/');
      }
    } catch (error) {
      if (error.response?.data?.error === 'Invalid credentials') {
        alert('Google orqali ro‘yxatdan o‘tilmagan!');
      } else {
        alert(error.response?.data?.message || error.message);
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    // Trigger Google button click programmatically
    const googleButton = divRef.current?.querySelector('div[role=button]');
    if (googleButton) {
      googleButton.click();
    }
  };

  return (
    <div className="flex  items-center  ">
      <div 
        onClick={handleButtonClick}
        className='flex items-center justify-center text-sm text-[#4285F4] gap-4 px-6 py-3 bg-[#E9F1FF] w-full max-w-[244px] mt-4 rounded-[9px] cursor-pointer hover:bg-[#D8E4FF] transition-colors'
      >
        {loading ? (
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            <img className='w-[21px]' src={googleIcon} alt="google" />
            <span>Google orqali kirish</span>
          </>
        )}
      </div>
      {/* Hidden Google button */}
      <div ref={divRef} className="hidden"></div>
    </div>
  );
};

export default GoogleRegister;