import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import authBG from '../assets/authBG.svg';
import back from '../assets/back.svg';
import { AiOutlineCheck } from 'react-icons/ai';

const Work = () => {
  const navigate = useNavigate();

  // Get initial state from localStorage if it exists
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')) || {});
  
  const [remoteWork, setRemoteWork] = useState(userData.remote_work || false);
  const [isStudent, setIsStudent] = useState(userData.is_student || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [selectedJob, setSelectedJob] = useState(userData.job || null);
  const [selectedEdu, setSelectedEdu] = useState(userData.subeduarea || null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sync state with localStorage changes
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData) {
      setUserData(storedData);
      setRemoteWork(storedData.remote_work || false);
      setIsStudent(storedData.is_student || false);
      setSelectedJob(storedData.job || null);
      setSelectedEdu(storedData.subeduarea || null);
    }
  }, []);

  // Load data based on isStudent status
  useEffect(() => {
    setLoading(true);
    const apiUrl = isStudent ? '/api/eduareas/' : '/api/jobs/';

    axios.get(apiUrl)
      .then((response) => {
        setData(response.data || []);
        setError(null);
      })
      .catch((error) => {
        setError('Ma\'lumotlarni yuklashda xatolik yuz berdi');
        console.error('Error fetching data:', error);
      })
      .finally(() => setLoading(false));
  }, [isStudent]);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleJobSelection = (itemId) => {
    setSelectedJob(itemId === selectedJob ? null : itemId);
    if (isStudent) {
      setIsStudent(false);
      setSelectedEdu(null);
    }
  };

  const handleEduSelection = (itemId) => {
    setSelectedEdu(itemId === selectedEdu ? null : itemId);
    if (!isStudent) {
      setIsStudent(true);
      setSelectedJob(null);
    }
  };

  const toggleRemoteWork = () => {
    const newRemoteWork = !remoteWork;
    setRemoteWork(newRemoteWork);
    
    // Update localStorage immediately
    const updatedData = {
      ...userData,
      remote_work: newRemoteWork
    };
    localStorage.setItem('userData', JSON.stringify(updatedData));
    setUserData(updatedData);
  };

  const toggleStudentStatus = () => {
    const newStudentStatus = !isStudent;
    setIsStudent(newStudentStatus);
    
    if (newStudentStatus) {
      setSelectedJob(null);
    } else {
      setSelectedEdu(null);
    }
  };

  const handleContinue = async () => {
    if (isStudent && !selectedEdu) {
      setError('Iltimos, ta\'lim yo\'nalishini tanlang');
      return;
    }
    if (!isStudent && !selectedJob) {
      setError('Iltimos, ish turini tanlang');
      return;
    }

    setSubmitting(true);
    setError(null);

    // Prepare the data to be saved
    const updatedData = {
      ...userData,
      remote_work: remoteWork,
      is_student: isStudent
    };

    if (isStudent) {
      let eduAreaId = null;
      
      for (const category of data) {
        if (category.subeduarea) {
          const selectedItem = category.subeduarea.find(item => item.id === selectedEdu);
          if (selectedItem) {
            eduAreaId = category.pk;
            break;
          }
        }
      }

      if (eduAreaId !== null) {
        updatedData.eduarea = eduAreaId;
        updatedData.subeduarea = selectedEdu;
        delete updatedData.jobcategory;
        delete updatedData.job;
      }
    } else {
      let jobCategoryId = null;
      
      for (const category of data) {
        if (category.subjobs) {
          const selectedItem = category.subjobs.find(item => item.id === selectedJob);
          if (selectedItem) {
            jobCategoryId = category.id;
            break;
          }
        }
      }

      if (jobCategoryId !== null) {
        updatedData.jobcategory = jobCategoryId;
        updatedData.job = selectedJob;
        delete updatedData.eduarea;
        delete updatedData.subeduarea;
      }
    }

    try {
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Save to API
      const response = await axios.post('/api/profile/', updatedData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Save to localStorage
      localStorage.setItem('userData', JSON.stringify(updatedData));
      setUserData(updatedData);
      
      // Navigate to next page
      navigate('/');
    } catch (error) {
      console.error('Error saving profile data:', error);
      setError('Profil ma\'lumotlarini saqlashda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredData = data.filter(item => {
    const subs = isStudent ? item.subeduarea : item.subjobs;
    return subs?.some(sub =>
      sub.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${authBG})` }}
    >
      <div className="max-w-[400px] w-full bg-white px-6 py-8 rounded-[30px] flex flex-col text-center gap-2.5 scale-90">
        
        {/* Back Button */}
        <div className="flex flex-col w-full">
          <button type="button" onClick={() => navigate(-1)} className="self-start">
            <img src={back} alt="back" className="w-5" />
          </button>
        </div>

        <h1 className="text-2xl font-semibold">Profil yaratish!</h1>
        <p className="text-[#979191] text-sm">
        Hisobingizni yaratish uchun zarur maydonlarni to‘ldiring.
        </p>

        {/* Remote Work Toggle */}
        

        {/* Student Toggle */}
        <div className="w-full">
          <label className="flex items-center justify-between font-medium">
            <span>Men talabaman:</span>
            <div
              onClick={toggleStudentStatus}
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${isStudent ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${isStudent ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </label>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Qidirish..."
          className="w-full border border-blue-400 rounded-md px-3 py-2 text-sm focus:outline-none hover:border-blue-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Areas or Jobs List */}
        <div className="w-full flex flex-col gap-4 mt-4 h-[200px] overflow-y-auto pr-2 scrollbar-hide">
          {loading ? (
            <p>Yuklanmoqda...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredData.length === 0 ? (
            <p>Ma'lumot topilmadi</p>
          ) : (
            filteredData.map((category) => (
              <div key={category.id || category.pk} className="text-left">
                <h3 className="font-medium text-[16px] text-gray-500 mb-2">{category.name}</h3>
                <div className="flex flex-col gap-2 ml-2">
                  {(isStudent ? category.subeduarea : category.subjobs)?.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => isStudent ? handleEduSelection(item.id) : handleJobSelection(item.id)}
                      className={`flex items-center text-[16px] justify-between p-2 rounded-md cursor-pointer ${(
                        (isStudent && selectedEdu === item.id) ||
                        (!isStudent && selectedJob === item.id)
                      ) ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                    >
                      <span>{item.name}</span>
                      {(isStudent ? selectedEdu === item.id : selectedJob === item.id) && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <AiOutlineCheck className="text-white text-sm" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="w-full">
          <label className="flex items-center justify-between font-medium ">
            <span>Masofadan ishlayman:</span>
            <div
              onClick={toggleRemoteWork}
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${remoteWork ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${remoteWork ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </label>
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          onClick={handleContinue}
          className="flex justify-center py-2.5 mt-3 bg-blue-600 w-full rounded-[10px] text-white text-[16px] cursor-pointer hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          disabled={submitting || loading}
        >
          {submitting ? 'Saqlanmoqda...' : 'Davom etish'}
        </button>

        {/* Error */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default Work;