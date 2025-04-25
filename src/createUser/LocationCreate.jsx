import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../axios';
import authBG from '../assets/authBG.svg';
import back from '../assets/back.svg';
import { AiOutlineCheck } from 'react-icons/ai'; // react-icons

const LocationCreate = () => {
  const navigate = useNavigate();

  const [regions, setRegions] = useState([]);
  const [selectedTerritoryId, setSelectedTerritoryId] = useState(null);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Check user data in localStorage and process name if needed
    const savedUserData = JSON.parse(localStorage.getItem('userData')) || {};

    if (!savedUserData.full_name) {
      // Extract the part before @ from email
      const username = savedUserData.user.email.split('@')[0];
      const updatedUserData = {
        ...savedUserData,
        full_name: username
      };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
    }

    // Load regions data
    setLoading(true);
    axios.get('/api/regions/')
      .then((response) => {
        setRegions(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error('API xatolik:', error);
        setError('Regionlarni yuklashda xatolik yuz berdi');
      })
      .finally(() => setLoading(false));

    // Check if region and territory are already saved in localStorage
    if (savedUserData.region && savedUserData.territory) {
      setSelectedRegionId(savedUserData.region);
      setSelectedTerritoryId(savedUserData.territory);
    }
  }, []);

  const handleTerritoryClick = (territoryId) => {
    // Agar shu id allaqachon tanlangan bo'lsa, uni bekor qilamiz (null qilamiz)
    if (selectedTerritoryId === territoryId) {
      setSelectedTerritoryId(null);
    } else {
      setSelectedTerritoryId(territoryId);
    }
  };

  const handleContinue = () => {
    let selectedTerritory = null;
    let selectedRegion = null;

    for (let region of regions) {
      selectedTerritory = region.territories.find(territory => territory.id === selectedTerritoryId);
      if (selectedTerritory) {
        selectedRegion = region.id;
        break;
      }
    }

    if (selectedTerritory) {
      const updatedUserData = {
        ...JSON.parse(localStorage.getItem('userData')) || {},
        region: selectedRegion,
        territory: selectedTerritory.id,
      };

      localStorage.setItem('userData', JSON.stringify(updatedUserData));

      navigate('/work'); // Replace with the actual next page route
    } else {
      alert('Iltimos, tuman/shaharni tanlang');
    }
  };

  const filteredRegions = regions.map(region => ({
    ...region,
    territories: region.territories.filter(territory =>
      territory.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(region => region.territories.length > 0);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat "
      style={{ backgroundImage: `url(${authBG})` }}
    >
      <div className="max-w-[400px] w-full bg-white px-6 py-8 rounded-[30px] flex items-center justify-center flex-col text-center gap-2.5 scale-90">
        <div className="flex flex-col w-full">
          <button
            type="button"
            onClick={() => navigate("/main")}
            className="self-start"
          >
            <img src={back} alt="back" className="w-5" />
          </button>
        </div>

        <h1 className="text-xl font-semibold">Joylashuvingizni tanlang!</h1>
        <p className="text-[#979191] text-sm">Hududingizdagi hamkasblar va do'stlarni topish uchun joylashuvingizni belgilang.</p>

        {/* SEARCH INPUT */}
        <input
          type="text"
          placeholder="Qidirish..."
          className="w-full border border-blue-400 rounded-md px-3 py-2 text-sm focus:outline-none hover:border-blue-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="w-full flex flex-col gap-4 mt-4 h-[300px] overflow-y-auto pr-2 scrollbar-hide">
          {filteredRegions.map(region => (
            <div key={region.id} className="text-left">
              <h2 className="text-[16px] text-gray-400 ">{region.name}</h2>
              <div className="flex flex-wrap">
                {region.territories.map(territory => (
                  <div
                    key={territory.id}
                    onClick={() => handleTerritoryClick(territory.id)}
                    className={`flex items-center justify-between w-full p-3 rounded-lg text-[16px] cursor-pointer transition-all duration-300 ${selectedTerritoryId === territory.id ? ' bg-blue-50' : 'border-gray-300'
                      }`}
                  >
                    <span className="">{territory.name}</span>

                    {selectedTerritoryId === territory.id && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <AiOutlineCheck className="text-white text-sm" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          onClick={handleContinue}
          className="flex justify-center items-center py-2.5 mt-3 bg-bluenew w-full rounded-[10px] text-white text-[16px] cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Davom etish'
          )}
        </button>


      </div>
    </div>
  );
};

export default LocationCreate;