import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import User from "../components/User";
import StoriesUser from "../components/StorisUser";
import Posts from "../components/Posts";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        navigate("/main");
      } else {
        try {
          const response = await fetch("https://karyeraweb.pythonanywhere.com/api/check-profile/", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            // Profil ID ni localStorage ga saqlash
            if (data.profile?.id) {
              localStorage.setItem("myId", data.profile.id.toString());
            }
          } else {
            if (response.status === 401) {
              navigate("/login");
            } else if (response.status === 404) {
              navigate("/locationCreate");
            } else {
              console.error("Serverdan xato javob keldi:", response.status);
            }
          }
        } catch (error) {
          console.error("Xatolik yuz berdi:", error);
          // Xatolik bo'lsa, foydalanuvchini login sahifasiga yo'naltirish
          navigate("/login");
        }
      }
    };

    checkProfile();
  }, [navigate]);

  return (
    <div>
      <div className="max-w-[700px] flex">
        <User />
        <StoriesUser />
      </div>
      <div>
        <Posts />
      </div>
    </div>
  );
}

export default Home;