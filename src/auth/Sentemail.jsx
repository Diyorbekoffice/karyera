import authBG from '../assets/authBG.svg';
import sentemail from '../assets/resEmail.svg';
import back from '../assets/back.svg';
import { useRef } from 'react';

const Sentemail = () => {

    const emailRef = useRef(null);

  const handleClick = () => {
    emailRef.current.click();
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${authBG})` }}>
      <form className="max-w-[450px] w-full bg-white px-8 py-10 rounded-[40px] scale-80 flex items-center justify-center flex-col text-center gap-6">
        <div className='flex flex-col  w-full'>
          <a href="login"><img src={back} alt="back" className='w-5' /></a>
          <div className=' flex justify-center'>
            <img src={sentemail} alt="sentemail" className='w-36' />
          </div>
        </div>
        <h1 className='text-3xl font-semibold'>Qayta tiklash havolasi yuborildi!</h1>
        <p className='text-[#979191]'>Elektron pochta ilovangizga o'ting va tasdiqlash havolasiga bosing.</p>

        <div className='flex flex-col w-full gap-4 mt-2'>
          

          <div className='flex flex-col items-center gap-6 mt-4 w-full'>
          <a ref={emailRef} href="https://mail.google.com/" target="_blank" className='flex justify-center py-2.5  mt-3 bg-bluenew w-full rounded-[10px] text-white text-[18px]'>Gmail</a>
          </div>
           
      
        </div>
      </form>
    </div>
  );
};

export default Sentemail;
