import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import authBG from '../assets/authBG.svg';
import google from '../assets/google.svg';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import GoogleRegister from '../components/GoogleRegister';

const Register = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFormErrors({
      email: '',
      password: '',
      confirmPassword: '',
    });

    const userData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirm: confirmPasswordRef.current.value,
    };

    let isValid = true;

    // Validate email
    if (!userData.email) {
      setFormErrors((prevErrors) => ({ ...prevErrors, email: 'Email manzilingizni kiriting.' }));
      isValid = false;
    }

    // Validate password
    if (!userData.password) {
      setFormErrors((prevErrors) => ({ ...prevErrors, password: 'Parol kiriting.' }));
      isValid = false;
    }

    // Validate confirm password
    if (!userData.password_confirm) {
      setFormErrors((prevErrors) => ({ ...prevErrors, confirmPassword: 'Parolni takrorlang.' }));
      isValid = false;
    }

    // Check if passwords match
    if (userData.password !== userData.password_confirm) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: 'Parollar bir xil bo\'lishi kerak.',
      }));
      isValid = false;
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/user/register/', userData);

      if (response.status === 200 || response.status === 201) {
        alert(response.data.message || 'Muvaffaqiyatli ro‘yxatdan o‘tildi!');
        navigate('/verification', {
          state: {
            data: response.data,
            email: userData.email,
          },
        });
      }
    } catch (error) {
      console.error('Register xatosi:', error.response?.data || error.message);

      const data = error.response?.data;
      let errorMessage = 'Ro‘yxatdan o‘tishda xatolik yuz berdi';

      if (data) {
        if (typeof data === 'object') {
          const firstKey = Object.keys(data)[0];
          if (Array.isArray(data[firstKey])) {
            errorMessage = data[firstKey][0];
          }
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${authBG})` }}>
      <form onSubmit={handleSubmit} className="max-w-[420px] w-full bg-white p-10 rounded-[40px] scale-80">
        <div className='flex justify-between'>
          <p className='text-2xl'>Xush kelibsiz!</p>
          <p className='text-sm flex flex-col items-end text-[#8D8D8D]'>
            Hisobingiz bormi?
            <a href='/Login' className='text-bluenew font-medium cursor-pointer'>Kirish</a>
          </p>
        </div>

        <h1 className='text-3xl font-semibold'>Ro’yxatdan o’tish</h1>

        <GoogleRegister />

        <div className='flex flex-col w-full gap-4 mt-9'>
          {error && <div className="text-red-500 text-center">{error}</div>}

          <label className='flex flex-col gap-2'>
            Emailingiz
            <input ref={emailRef} type="email" placeholder="Email" className='px-5 py-3 border-2 border-[#4285F4] rounded-[10px] focus:outline-none' />
            {formErrors.email && <div className="text-red-500 text-xs mt-1">{formErrors.email}</div>}
          </label>

          <label className='flex flex-col gap-2 relative'>
            Parolingiz
            <input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              placeholder="Parol"
              className='px-5 py-3 border-2 border-[#4285F4] rounded-[10px] focus:outline-none'
            />
            {formErrors.password && <div className="text-red-500 text-xs mt-1">{formErrors.password}</div>}
            <div
              className="absolute right-4 top-[45px] cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </div>
          </label>

          <label className='flex flex-col gap-2 relative'>
            Parolni takrorlang
            <input
              ref={confirmPasswordRef}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Parol"
              className='px-5 py-3 border-2 border-[#4285F4] rounded-[10px] focus:outline-none'
            />
            {formErrors.confirmPassword && <div className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</div>}
            <div
              className="absolute right-4 top-[45px] cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </div>
          </label>

          <div className='flex flex-col items-end gap-10'>
            <button
              type="submit"
              className='flex justify-center items-center gap-2 px-5 py-2.5 bg-bluenew max-w-[200px] rounded-[10px] text-white text-[18px] cursor-pointer'
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Ro’yxatdan o’tish"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
