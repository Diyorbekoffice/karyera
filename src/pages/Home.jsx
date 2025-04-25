import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import User from "../components/User";
import StorisMe from "../components/StorisMe";


function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        navigate("/main");
      } else {
        const response = await fetch("https://karyeraweb.pythonanywhere.com/api/check-profile/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
        } else {
          if (response.status === 401) {
            navigate("/login");
          } else if (response.status === 404) {
            navigate("/locationCreate");
          } else {
            console.error("Serverdan xato javob keldi:", response.status);
          }
        }
      }
    };

    checkProfile();
  }, [navigate]);

  return (
    <div className="px-[240px]">
      <User />
      
    </div>
  );
}

export default Home;
