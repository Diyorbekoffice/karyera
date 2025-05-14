import React, { useState, useEffect } from "react";
import axios from "../axios"; // axios instansiyasi import qilinadi
import { FaUser } from "react-icons/fa";

function Search() {
  const [query, setQuery] = useState(""); // Qidiruv so'rovini saqlash
  const [profiles, setProfiles] = useState([]); // Foydalanuvchi profillarini saqlash
  const [loading, setLoading] = useState(false); // Yuklanayotgan holatni kuzatish
  const [error, setError] = useState(""); // Xatoliklarni ko'rsatish
  const [timer, setTimer] = useState(null); // Debouncing uchun timer

  useEffect(() => {
    if (query.length === 0) return; // Agar query bo'sh bo'lsa, hech narsa qilmaslik

    // Agar timer bo'lsa, to'xtatish
    if (timer) clearTimeout(timer);

    // Yangi timer yaratish
    const newTimer = setTimeout(() => {
      fetchProfiles(query);
    }, 200); // 2 soniya kutish

    setTimer(newTimer);

    // Cleanup
    return () => clearTimeout(newTimer);
  }, [query]);

  // Foydalanuvchi qidiruvini yuborish
  const fetchProfiles = (searchQuery) => {
    setLoading(true);
    const token = localStorage.getItem("accessToken"); // localStorage'dan token olish

    axios
      .get(`/api/profile/search/?query=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Tokenni so'rovga qo'shish
        },
      })
      .then((response) => {
        setProfiles(response.data.results.results); // Foydalanuvchi ma'lumotlarini saqlash
        setLoading(false);
        setError(""); // Xatolikni tozalash
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setError("Foydalanuvchilarni olishda xato yuz berdi");
      });
  };

  return (
    <div className="p-4 relative">
      <div className="flex-1 mx-4 w-md">
        <input
          type="text"
          placeholder="Qidirish..."
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Queryni o'zgartirish
          className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      
      

     
      {query && (
        <div className="absolute z-10 bg-neutral-300 rounded-2xl w-md left-10 mt-4 p-3 ">
        {loading && <p>Yuklanmoqda...</p>}
        {profiles.length > 0 ? (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Topilgan Foydalanuvchilar:</h2>
            <ul>
            {profiles.map((profile) => (
                <li key={profile.id} className="flex items-center my-2">
                  {/* Agar profil rasmi bo'lmasa, ikonka chiqarish */}
                  {profile.profile_image ? (
                    <img
                      src={profile.profile_image}
                      alt={profile.full_name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  ) : (
                    <FaUser className="w-8 h-8 text-gray-500 border rounded-full  mr-3" /> // Foydalanuvchi ikonkasi
                  )}
                  <div>
                    <p className="font-semibold">{profile.full_name}</p>
                    <p>{profile.region}, {profile.territory}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : query && !loading ? (
          <p className="text-gray-500">Bunday foydalanuvchi topilmadi</p>
        ) : null}
        </div>
      )

      }
    </div>
  );
}

export default Search;
