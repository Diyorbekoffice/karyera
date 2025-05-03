import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaSearch, FaCheck } from 'react-icons/fa';
import { AiOutlineCheck } from 'react-icons/ai';

function ProfileEdit({ userData }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [formData, setFormData] = useState({
        full_name: '',
        bio: '',
        region: null,
        territory: null,
        job: null,
        jobcategory: null,
        is_student: false,
        remote_work: false,
        eduarea: null,
        subeduarea: null
    });
    const [regions, setRegions] = useState([]);
    const [educationData, setEducationData] = useState([]);
    const [jobsData, setJobsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [locationSearch, setLocationSearch] = useState('');
    const [eduJobSearch, setEduJobSearch] = useState('');
    const [isStudent, setIsStudent] = useState(false);

    // Fetch all initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const [regionsRes, eduRes, jobsRes] = await Promise.all([
                    axios.get('https://karyeraweb.pythonanywhere.com/api/regions/', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('https://karyeraweb.pythonanywhere.com/api/eduareas/', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('https://karyeraweb.pythonanywhere.com/api/jobs/', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setRegions(regionsRes.data);
                setEducationData(eduRes.data);
                setJobsData(jobsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Open modal and load profile data
    const openModal = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(
                `https://karyeraweb.pythonanywhere.com/api/profile/${userData}/`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const data = response.data;
            const studentStatus = Boolean(data.eduarea);

            const initialData = {
                full_name: data.full_name || '',
                bio: data.bio || '',
                region: data.region || null,
                territory: data.territory || null,
                job: data.job || null,
                jobcategory: data.jobcategory || null,
                is_student: studentStatus,
                remote_work: data.remote_work || false,
                eduarea: data.eduarea || null,
                subeduarea: data.subeduarea || null
            };

            setOriginalData(initialData);
            setFormData(initialData);
            setIsStudent(studentStatus);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage({ text: 'Failed to load profile data', type: 'error' });
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle location selection
    const handleLocationSelect = (regionId, territoryId) => {
        setFormData(prev => ({
            ...prev,
            region: regionId,
            territory: territoryId
        }));
    };

    // Toggle student status
    const toggleStudentStatus = () => {
        const newStatus = !isStudent;
        setIsStudent(newStatus);
        setFormData(prev => ({
            ...prev,
            is_student: newStatus,
            ...(newStatus ? { 
                job: null, 
                jobcategory: null 
            } : { 
                eduarea: null, 
                subeduarea: null 
            })
        }));
    };

    // Handle job selection
    const handleJobSelect = (jobId, categoryId) => {
        setFormData(prev => ({
            ...prev,
            job: jobId,
            jobcategory: categoryId,
            is_student: false,
            eduarea: null,
            subeduarea: null
        }));
        setIsStudent(false);
    };

    // Handle education selection
    const handleEduSelect = (eduId, areaId) => {
        setFormData(prev => ({
            ...prev,
            subeduarea: eduId,
            eduarea: areaId,
            is_student: true,
            job: null,
            jobcategory: null
        }));
        setIsStudent(true);
    };

    // Update profile with only changed fields
    const updateProfile = async () => {
        try {
            setIsLoading(true);
            setMessage({ text: '', type: '' });

            // Find changed fields
            const changedFields = {};
            for (const key in formData) {
                if (JSON.stringify(formData[key]) !== JSON.stringify(originalData[key])) {
                    changedFields[key] = formData[key];
                }
            }

            // If nothing changed, close modal
            if (Object.keys(changedFields).length === 0) {
                setIsModalOpen(false);
                return;
            }

            // Don't send is_student if education/job fields didn't change
            if (changedFields.is_student !== undefined) {
                const educationChanged = changedFields.eduarea !== undefined || 
                                        changedFields.subeduarea !== undefined;
                const jobChanged = changedFields.job !== undefined || 
                                  changedFields.jobcategory !== undefined;
                
                if (!educationChanged && !jobChanged) {
                    delete changedFields.is_student;
                }
            }

            // If no fields left to update after filtering, close modal
            if (Object.keys(changedFields).length === 0) {
                setIsModalOpen(false);
                return;
            }

            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            await axios.patch(
                `https://karyeraweb.pythonanywhere.com/api/profile/${userData}/`,
                changedFields,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setMessage({ text: 'Profile updated successfully!', type: 'success' });
            setTimeout(() => {
                setIsModalOpen(false);
                window.location.reload();
            }, 1500);
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            setMessage({ text: `Error: ${errorMsg}`, type: 'error' });
            console.error('Update failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter regions based on search
    const filteredRegions = regions.map(region => ({
        ...region,
        territories: region.territories.filter(territory =>
            territory.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
            region.name.toLowerCase().includes(locationSearch.toLowerCase())
        )
    })).filter(region => region.territories.length > 0);

    // Filter education/jobs based on search
    const filteredEduJobs = isStudent
        ? educationData.map(area => ({
            ...area,
            subeduarea: area.subeduarea?.filter(item =>
                item.name.toLowerCase().includes(eduJobSearch.toLowerCase()) ||
                area.name.toLowerCase().includes(eduJobSearch.toLowerCase())
            )
        })).filter(area => area.subeduarea?.length > 0)
        : jobsData.map(job => ({
            ...job,
            subjobs: job.subjobs?.filter(item =>
                item.name.toLowerCase().includes(eduJobSearch.toLowerCase()) ||
                job.name.toLowerCase().includes(eduJobSearch.toLowerCase())
            )
        })).filter(job => job.subjobs?.length > 0);

    // Get selected location name for display
    const getSelectedLocationName = () => {
        if (!formData.region || !formData.territory) return "Select location";
        
        const region = regions.find(r => r.id === formData.region);
        if (!region) return "Select location";
        
        const territory = region.territories.find(t => t.id === formData.territory);
        if (!territory) return "Select location";
        
        return `${territory.name}, ${region.name}`;
    };

    // Get selected education/job name for display
    const getSelectedEduJobName = () => {
        if (isStudent) {
            if (!formData.eduarea || !formData.subeduarea) return "Select education";
            
            const area = educationData.find(a => a.pk === formData.eduarea);
            if (!area) return "Select education";
            
            const subarea = area.subeduarea.find(s => s.id === formData.subeduarea);
            if (!subarea) return "Select education";
            
            return `${subarea.name}, ${area.name}`;
        } else {
            if (!formData.jobcategory || !formData.job) return "Select job";
            
            const category = jobsData.find(j => j.id === formData.jobcategory);
            if (!category) return "Select job";
            
            const job = category.subjobs.find(s => s.id === formData.job);
            if (!job) return "Select job";
            
            return `${job.name}, ${category.name}`;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={openModal}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
                <FaEdit /> Profilni tahrirlash
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h2>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2 font-medium">Full Name</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2 font-medium">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    placeholder="Tell about yourself"
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2 font-medium">
                                    Location: <span className="font-normal text-blue-600">{getSelectedLocationName()}</span>
                                </label>
                                <div className="relative mb-2">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaSearch className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={locationSearch}
                                        onChange={(e) => setLocationSearch(e.target.value)}
                                        placeholder="Search location..."
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="border border-gray-200 rounded-md overflow-hidden">
                                    <div className="max-h-[200px] overflow-y-auto">
                                        {filteredRegions.map(region => (
                                            <div key={region.id} className="mb-1 last:mb-0">
                                                <div className="bg-gray-100 px-3 py-2 font-medium text-gray-700 sticky top-0 z-10">
                                                    {region.name}
                                                </div>
                                                <div className="divide-y divide-gray-100">
                                                    {region.territories.map(territory => (
                                                        <div
                                                            key={territory.id}
                                                            className={`px-3 py-2 cursor-pointer flex justify-between items-center ${
                                                                formData.territory === territory.id
                                                                    ? 'bg-blue-50 text-blue-600'
                                                                    : 'hover:bg-gray-50'
                                                            }`}
                                                            onClick={() => handleLocationSelect(region.id, territory.id)}
                                                        >
                                                            <span>{territory.name}</span>
                                                            {formData.territory === territory.id && (
                                                                <FaCheck className="text-green-500" />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="flex items-center justify-between font-medium mb-2">
                                    <span>I am a student:</span>
                                    <div
                                        onClick={toggleStudentStatus}
                                        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                                            isStudent ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                    >
                                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${
                                            isStudent ? 'translate-x-6' : 'translate-x-0'
                                        }`} />
                                    </div>
                                </label>

                                <label className="block text-gray-700 mb-2">
                                    {isStudent ? "Education:" : "Job:"} 
                                    <span className="font-normal text-blue-600 ml-2">{getSelectedEduJobName()}</span>
                                </label>

                                <div className="relative mb-2">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaSearch className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={eduJobSearch}
                                        onChange={(e) => setEduJobSearch(e.target.value)}
                                        placeholder="Search..."
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="border border-gray-200 rounded-md overflow-hidden">
                                    <div className="max-h-[200px] overflow-y-auto">
                                        {filteredEduJobs.length === 0 ? (
                                            <p className="p-3 text-gray-500 text-center">No results found</p>
                                        ) : (
                                            filteredEduJobs.map((category) => (
                                                <div key={category.id || category.pk} className="mb-1 last:mb-0">
                                                    <div className="bg-gray-100 px-3 py-2 font-medium text-gray-700 sticky top-0 z-10">
                                                        {category.name}
                                                    </div>
                                                    <div className="divide-y divide-gray-100">
                                                        {(isStudent ? category.subeduarea : category.subjobs)?.map((item) => (
                                                            <div
                                                                key={item.id}
                                                                onClick={() => isStudent
                                                                    ? handleEduSelect(item.id, category.pk)
                                                                    : handleJobSelect(item.id, category.id)}
                                                                className={`flex items-center justify-between px-3 py-2 cursor-pointer ${
                                                                    (isStudent && formData.subeduarea === item.id) ||
                                                                    (!isStudent && formData.job === item.id)
                                                                        ? 'bg-blue-50 text-blue-600'
                                                                        : 'hover:bg-gray-50'
                                                                }`}
                                                            >
                                                                <span>{item.name}</span>
                                                                {(isStudent && formData.subeduarea === item.id) ||
                                                                (!isStudent && formData.job === item.id) ? (
                                                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                                        <AiOutlineCheck className="text-white text-xs" />
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <span className="text-gray-700 font-medium">Remote work:</span>
                                <div
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        remote_work: !prev.remote_work
                                    }))}
                                    className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                                        formData.remote_work ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <div className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${
                                        formData.remote_work ? 'translate-x-6' : 'translate-x-0'
                                    }`} />
                                </div>
                            </div>

                            {message.text && (
                                <div className={`mb-4 p-3 rounded-md ${
                                    message.type === 'success'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {message.text}
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={updateProfile}
                                    disabled={isLoading}
                                    className={`px-4 py-2 rounded-md transition-colors ${
                                        isLoading
                                            ? 'bg-blue-300 cursor-not-allowed'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileEdit;