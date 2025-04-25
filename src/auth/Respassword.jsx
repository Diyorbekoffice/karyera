import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios'; // axios instance import qilindi
import authBG from '../assets/authBG.svg';
import respass from '../assets/respass.svg';
import back from '../assets/back.svg';

const Respassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Emailni yuborish uchun API ga POST so'rovi yuborish
      const response = await axios.post("/user/resend-verification-code/", { email });

      if (response.status === 200) {
        // Muvaffaqiyatli javob bo'lsa, alert chiqarish va login sahifasiga o'tish
        alert(response.data.message || "Parolni tiklash uchun yo'riqnoma yuborildi!");
        navigate("/login");
      } else {
        // Agar status 200 bo'lmasa, xato xabarini ko'rsatish
        alert(response.data.message || "Xatolik yuz berdi, iltimos qayta urinib ko'ring.");
      }
    } catch (error) {
      console.error("Xato:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Xato yuz berdi, iltimos qayta urinib ko'ring.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${authBG})` }}>
      <form onSubmit={handleSubmit} className="max-w-[450px] w-full bg-white px-8 py-10 rounded-[40px] scale-70 flex items-center justify-center flex-col text-center gap-6">
        <div className='flex flex-col w-full'>
          <a href="login"><img src={back} alt="back" className='w-5' /></a>
          <div className=' flex justify-center'>
            <img src={respass} alt="respass" className='w-24' />
          </div>
        </div>
        <h1 className='text-3xl font-semibold'>Parolni tiklash!</h1>
        <p className='text-[#979191]'>Iltimos, ro‘yxatdan o‘tgan email manzilingizni kiriting, biz unga parolni tiklash yo‘riqnomasi yuboramiz.</p>

        <div className='flex flex-col w-full gap-4 mt-2'>
          <label className='flex flex-col gap-2 text-left'>
            <input 
              type="email" 
              placeholder="Email" 
              className='px-5 py-3 border-2 border-[#4285F4] rounded-[10px] focus:outline-none' 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </label>

          <div className='flex flex-col items-center gap-6 mt-4 w-full'>
            <button type="submit" className='flex justify-center py-2.5 mt-3 bg-bluenew w-full rounded-[10px] text-white text-[18px] cursor-pointer'>
              Davom etish
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Respassword;
