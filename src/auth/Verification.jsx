import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../axios';
import authBG from '../assets/authBG.svg';

const Verification = () => {
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email || "Email topilmadi";
  const accessToken = state.data.access || "";

  

  const [timer, setTimer] = useState(120);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [loadingButton, setLoadingButton] = useState("");

  useEffect(() => {
    if (timer === 0) {
      setIsResendEnabled(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (value && index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    } else if (!value && e.key === "Backspace" && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const verification_code = inputRefs.map(ref => ref.current.value).join("");

    if (verification_code.length !== 6) {
      alert("Iltimos, to‘liq 6 xonali kodni kiriting!");
      return;
    }

    setLoadingButton("verify");

    try {
      const response = await axios.post("/user/verify-email/", {
        email,
        verification_code,
      });

      if (response.status === 200) {
        alert("Email tasdiqlandi!");

        // userData shaklida emailni localStorage ga saqlash
        const userData = {
          user: {
            email: email
          }
        };
        localStorage.setItem('userData', JSON.stringify(userData));

        // accessToken ni localStorage ga saqlash
        localStorage.setItem('accessToken', accessToken);

        // Keyingi sahifaga navigate
        navigate("/locationcreate");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Kod noto‘g‘ri yoki xatolik yuz berdi.");
    } finally {
      setLoadingButton("");
    }
  };

  const handleResendCode = async () => {
    if (!isResendEnabled) return;

    setLoadingButton("resend");

    try {
      await axios.post("/user/resend-verification-code/", { email });
      alert("Kod qayta yuborildi!");
      setTimer(120);
      setIsResendEnabled(false);
    } catch (error) {
      alert("Kod yuborishda xatolik yuz berdi.");
    } finally {
      setLoadingButton("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${authBG})` }}>
      <form onSubmit={handleSubmit} className="max-w-[420px] w-full bg-white px-6 py-10 rounded-[40px] flex flex-col items-center gap-2.5 scale-80">
        <h1 className='text-[22px] font-semibold'>Tasdiqlash kodi</h1>
        <p className='text-[12px] text-[#979191] mt-2'>Iltimos, elektron pochtaga yuborilgan kodni kiriting</p>
        <p className='text-sm text-center font-medium mt-1'>{email}</p>

        <div className='flex gap-2 mt-10'>
          {inputRefs.map((ref, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="w-10 h-14 border-2 border-blue-500 rounded-lg text-center text-xl focus:outline-none"
              ref={ref}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleChange(e, index)}
            />
          ))}
        </div>

        <div className='flex flex-col items-center gap-6 mt-4 w-full'>
          {timer > 0 ? (
            <p className='text-sm text-[#4285F4]'>
              Kodni qayta yuborish ({Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60})
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendCode}
              className='text-sm text-[#4285F4] bg-transparent border-none cursor-pointer'
              disabled={loadingButton === "resend"}
            >
              {loadingButton === "resend" ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              ) : (
                "Kodni qayta yuborish"
              )}
            </button>
          )}
          <button 
            type="submit" 
            className='flex justify-center items-center py-2.5 mt-3 bg-bluenew w-full rounded-[10px] text-white text-[18px] cursor-pointer'
            disabled={loadingButton === "verify"}
          >
            {loadingButton === "verify" ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Tasdiqlash"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Verification;
