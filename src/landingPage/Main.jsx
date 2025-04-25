import React, { useState } from "react";
import logo from '../assets/logo.svg';
import bg from '../assets/Main.svg';
import Col from '../assets/Col.svg';
// import bg from '../assets/authBG.svg';
import { FaRegCheckCircle, FaRegFileAlt, FaClock, FaComments, FaPaintBrush, FaChartBar, FaRobot, FaWpforms, FaTasks } from 'react-icons/fa';
import { FaTelegramPlane, FaInstagram, FaFacebookF, FaGooglePlay, FaSpinner } from 'react-icons/fa'
import { Link } from 'react-scroll';
import { useNavigate } from "react-router-dom";

export default function Main() {
    const [loginLoading, setLoginLoading] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);
    const navigate = useNavigate();

    const features = [
        { icon: <FaRegFileAlt />, title: "Docs" },
        { icon: <FaClock />, title: "Time tracking" },
        { icon: <FaComments />, title: "Chat" },
        { icon: <FaPaintBrush />, title: "Whiteboards" },
        { icon: <FaRegCheckCircle />, title: "Projects", active: true },
        { icon: <FaChartBar />, title: "Dashboards" },
        { icon: <FaRobot />, title: "AI" },
        { icon: <FaWpforms />, title: "Forms" },
        { icon: <FaTasks />, title: "Sprints" },
    ];



    const handleLoginClick = () => {
        setLoginLoading(true);
        setTimeout(() => {
            navigate('/login');
            setLoginLoading(false);
        }, 800);
    };

    const handleRegisterClick = () => {
        setRegisterLoading(true);
        setTimeout(() => {
            navigate('/register');
            setRegisterLoading(false);
        }, 800);
    };
    return (
        <div className="w-full bg-white">
            <div className="  flex flex-col items-center justify-center text-center  ">
                {/* Logo va Header */}
                <div id="logo" className="flex absolute top-4 justify-between gap-[720px]">
                    <a href="#" className="flex items-center boder border-[1px] p-1 pr-6 rounded-xl border-[#cac9c9] shadow-md">
                        <img src={logo} alt="logo" className="w-[36px] " />
                        <span className="font-bold text-xl">Karyera</span>
                    </a>

                    {/* Navbar */}
                    <div className=" flex items-center gap-4">
                        <Link
                            to="boglanish"
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={1500}
                            className="text-gray-600 hover:text-black boder border-[1px] px-3 py-2 rounded-xl border-[#cac9c9] shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg"
                        >
                            Bog'lanish
                        </Link>



                        <div className=" pl-3 pr-1 py-1 rounded-xl border-[#cac9c9] shadow-md flex justify-center gap-4 hover:shadow-lg transition-shadow duration-300">
                            {/* Login Button */}
                            <button
                                onClick={handleLoginClick}
                                disabled={loginLoading}
                                className={`flex items-center gap-2 text-gray-600 hover:text-black transition-all duration-300 ${loginLoading ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                                    }`}
                            >
                                {loginLoading && <FaSpinner className="animate-spin" />}
                                Tizimga kirish
                            </button>

                            {/* Register Button */}
                            <button
                                onClick={handleRegisterClick}
                                disabled={registerLoading}
                                className={`bg-gradient-to-r from-blue-600 to-purple-800 text-white px-4 font-bold py-1 rounded-[8px] shadow-md transition-all duration-300 ${registerLoading
                                    ? 'cursor-not-allowed opacity-85'
                                    : 'cursor-pointer hover:scale-105'
                                    }`}
                            >
                                {registerLoading ? (
                                    <div className="flex items-center gap-2">
                                        <FaSpinner className="animate-spin" />

                                    </div>
                                ) : (
                                    "Ro'yxatdan o'tish"
                                )}
                            </button>
                        </div>


                    </div>
                </div>

                {/* Kontent */}
                <div className="flex flex-col  mt-36">
                    <main >
                        <h1 className="text-6xl  font-[900] text-[#24223E] mb-4">
                            Tajriba, bilim va malaka -  biz  bilan <br /> bo'lishing va rivojlaning
                        </h1>
                        <p className="text-xl text-[#24223E] mb-6 font-semibold ">
                            Mutaxasisliok va kasb mahoratini oshirish <br /> uchun eng yaxshi online maydon
                        </p>

                        {/* Start Button */}
                        <button onClick={handleRegisterClick} className="bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white text-2xl px-16 py-4 rounded-[10px] font-bold shadow-lg hover:scale-105 transition cursor-pointer">
                            Jamoamizga qo'shiling →
                        </button>
                        <p className="mt-2 text-fuchsia-800">Oson, tez va ishonchli</p>


                    </main>
                    <div className="flex justify-center items-center gap-10 px-10 py-24 mt-12 ">
                        {features.map((item, index) => (
                            <div
                                key={index}
                                className={`flex flex-col items-center text-center p-2 rounded-xl cursor-pointer ${item.active
                                    ? 'bg-[#1e1e3f] text-white font-semibold'
                                    : 'text-[#9e9eaf] hover:text-[#555] transition'
                                    }`}
                            >
                                <div className="text-2xl mb-1">{item.icon}</div>
                                <span className="text-sm">{item.title}</span>
                            </div>
                        ))}
                    </div>
                </div>


            </div>
            <div
                className="h-screen bg-no-repeat bg-center bg-cover flex flex-col items-center justify-center text-white p-4"
                style={{ backgroundImage: `url(${bg})` }}
            >
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 max-w-2xl">
                    Jamoangizni barcha imkoniyatlarini ishga solishga tayyormisiz?
                </h2>

                <div className="flex flex-col md:flex-row gap-8 mb-6">
                    <button onClick={handleRegisterClick} className="px-6 py-3 bg-blue-600 rounded-xl text-lg font-semibold transition transform hover:scale-110 cursor-pointer">
                        Ha, albatta
                    </button>
                    <Link
                        to="malumot"
                        spy={true}
                        smooth={true}
                        offset={-100}
                        duration={700}
                    >
                        <button className="px-6 py-3 bg-white text-blue-600 rounded-xl text-lg font-semibold transition transform hover:scale-110 cursor-pointer">
                            Menga ko'proq ma'lumot bering
                        </button>
                    </Link>
                </div>

                <p className="text-center text-[16px] max-w-xl">
                    Biz bilan o‘z jamoangizning kuchini oching, karyerangizni yangi bosqichga olib chiqing. Hozir boshlang!
                </p>
            </div>
            <section className="py-16 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto px-4">
                    <h2 id="malumot" className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Nima uchun aynan biz?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                            <div className="text-blue-600 text-4xl mb-4">
                                🔍
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Tez va oson ish qidirish</h3>
                            <p className="text-gray-600">
                                Mutaxassisligingizga mos ish o‘rinlarini topish uchun faqat bir necha daqiqa.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                            <div className="text-blue-600 text-4xl mb-4">
                                👥
                            </div>
                            <h3 className="text-xl font-semibold mb-2">HR mutaxassislar maslahati</h3>
                            <p className="text-gray-600">
                                Ishga kirish bo‘yicha maslahatlar va intervyu sirlari bilan tanishing.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                            <div className="text-blue-600 text-4xl mb-4">
                                💬
                            </div>
                            <h3 className="text-xl font-semibold mb-2">To‘g‘ridan-to‘g‘ri aloqa</h3>
                            <p className="text-gray-600">
                                Ish beruvchilar bilan tezkor muloqot qiling va rezyumeni ulashing.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                            <div className="text-blue-600 text-4xl mb-4">
                                🛡️
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Xavfsiz platforma</h3>
                            <p className="text-gray-600">
                                Maʼlumotlaringiz to‘liq himoyalangan va ishonchli.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-20 bg-gradient-to-r from-yellow-50 via-white to-blue-50">
                <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
                    {/* Chap taraf matnlar */}
                    <div className="lg:w-1/2 mb-10 lg:mb-0">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Mobil Ilova Haqida</h2>
                        <p className="text-gray-600 mb-8">
                            Mutaxassislar, bilim egalari va biznes vakillari uchun yagona platforma! Yangi imkoniyatlarni kashf eting, tajriba al-mashing va kasbiy rivojlaning – barchasi bir ilovada!
                        </p>

                        <h3 className="text-2xl font-semibold mb-4">Karyera</h3>
                        <p className="text-gray-600 mb-6">
                            Ilovani hoziroq yuklab oling va bilim, tajriba hamda yangi imkoniyatlar dunyosiga qo‘shiling!
                        </p>

                        <a href="#" className="inline-block">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                alt="Google Play"
                                className="w-40"
                            />
                        </a>
                    </div>

                    {/* O'ng taraf telefon rasmi */}
                    <div className="lg:w-1/2 flex justify-center">
                        <img
                            src={Col}
                            alt="Mobil ilova"
                            className="w-[500px] max-w-full"
                        />
                    </div>

                </div>
            </section>

            <footer className="bg-gray-900 text-white pt-10 pb-6">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 items-start">

                    {/* Logo */}
                    <div className="space-y-4">

                        <Link
                            to="logo"
                            spy={true}
                            smooth={true}
                            offset={-70}
                            duration={1500}
                            className="flex items-center  p-2 pr-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                        >
                            <img src={logo} alt="logo" className="w-[40px] h-[40px]" />
                            <span className="ml-2 font-bold text-2xl">Karyera</span>
                        </Link>
                        <p className="text-gray-400 text-sm">
                            Mutaxassislar va bilim egalari uchun eng yaxshi imkoniyatlar platformasi.
                        </p>
                    </div>

                    {/* Bog'lanish */}
                    <div id="boglanish" className="space-y-4">
                        <h2 className="text-xl font-semibold mb-2">Bog'lanish</h2>
                        <p className="text-gray-400">📞 +998 93 667 66 70</p>
                        <p className="text-gray-400">✉️ karyerateam@gmail.com</p>
                        <p className="text-gray-400">📍 Farg'ona, O'zbekiston</p>
                    </div>

                    {/* Ijtimoiy Tarmoqlar */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-2">Ijtimoiy Tarmoqlar</h2>
                        <div className="flex space-x-4 text-2xl">
                            <a href="#" className="hover:text-blue-400 transition">
                                <FaTelegramPlane />
                            </a>
                            <a href="#" className="hover:text-pink-400 transition">
                                <FaInstagram />
                            </a>
                            <a href="#" className="hover:text-blue-600 transition">
                                <FaFacebookF />
                            </a>
                        </div>
                    </div>

                    {/* Ilovani Yuklab Olish */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-2">Ilovani Yuklab Olish</h2>
                        <a href="#" className="flex items-center gap-2">
                            <FaGooglePlay className="w- hover:scale-105 transition" /> Google Play
                        </a>
                    </div>

                </div>

                {/* Pastki qism */}
                <div className="mt-10 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
                    © 2025 Karyera Team. Barcha huquqlar himoyalangan.
                </div>
            </footer>
        </div>
    );
}


