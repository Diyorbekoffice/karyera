import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import axios from "../axios";
import authBG from '../assets/authBG.svg';
import google from '../assets/google.svg';

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [loadingButton, setLoadingButton] = useState(""); // 🔥 qaysi button bosilgani uchun

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = emailRef.current.value;
    const password = passwordRef.current.value;

    setLoadingButton("login"); // 🔥 Login button bosilganda

    try {
      const response = await axios.post("/user/login/", { username, password });

      if (response.status === 200) {
        const message = response.data.message;
        
        // Save the token separately in localStorage
        localStorage.setItem("accessToken", (response.data.access));

        const userData = { 
          user: { 
            email: username 
          } 
        };
        localStorage.setItem("userData", JSON.stringify(userData)); 

        // Redirect the user to the home page with a message
        navigate("/", { state: { message } });
      }
    } catch (error) {
      console.error("Login xatosi:", error.response?.data || error.message);
      const data = error.response?.data;
      let errorMessage = "Login xatoligi yuz berdi";

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
      setLoadingButton(""); // 🔥 tugatamiz
    }
  };

  const handleGoogleLogin = () => {
    setLoadingButton("google"); // 🔥 Google button bosilganda
    // Google login funksiyasi shu yerda yoziladi
    setTimeout(() => {
      setLoadingButton("");
      alert("Google login hali tayyor emas 😉");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${authBG})` }}>
      <form onSubmit={handleSubmit} className="max-w-[420px] w-full bg-white p-10 rounded-[40px] scale-80">
        <div className='flex justify-between'>
          <p className='text-2xl'>Xush kelibsiz!</p>
          <p className='text-sm flex flex-col items-end text-[#8D8D8D]'>Hisobingiz yo‘qmi? <a href='/register' className='text-bluenew font-medium cursor-pointer'>Ro’yxatdan o’tish</a></p>
        </div>
        <h1 className='text-3xl font-semibold'>Kirish</h1>

        {/* Google Button */}
        <div
          onClick={handleGoogleLogin}
          className='flex items-center justify-center text-sm text-[#4285F4] gap-4 px-6 py-3 bg-[#E9F1FF] max-w-[244px] mt-4 rounded-[9px] cursor-pointer'
        >
          {loadingButton === "google" ? (
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <img className='w-[21px]' src={google} alt="google" />
              <span>Google orqali kirish</span>
            </>
          )}
        </div>

        {/* Inputs */}
        <div className='flex flex-col w-full gap-4 mt-9'>
          <label className='flex flex-col gap-2'>Emailingiz
            <input
              type="email"
              placeholder="Email"
              ref={emailRef}
              className='px-5 py-3 border-2 border-[#4285F4] rounded-[10px] focus:outline-none'
              required
            />
          </label>

          <label className='flex flex-col gap-2 relative'>Parolingiz
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Parol"
              ref={passwordRef}
              className='px-5 py-3 border-2 border-[#4285F4] rounded-[10px] focus:outline-none pr-12'
              required
            />
            <div
              className="absolute right-3 top-11 cursor-pointer text-gray-500"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
            </div>
          </label>

          <div className='flex flex-col items-end gap-6'>
            <a href="/respassword" className='text-sm text-[#4285F4]'>Parolingizni unutdingizmi?</a>

            {/* Login Button */}
            <button
              type="submit"
              className='flex items-center justify-center px-5 py-2.5 bg-bluenew max-w-[200px] rounded-[10px] text-white text-[18px] cursor-pointer'
              disabled={loadingButton === "login"}
            >
              {loadingButton === "login" ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Kirish"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
