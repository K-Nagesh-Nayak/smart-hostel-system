import { useState } from 'react';
import axios from 'axios';
import { FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const StaffAttendance = () => {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [msg, setMsg] = useState('');

  const handleClockIn = () => {
    setStatus('loading');
    if (!navigator.geolocation) {
      setMsg('Geolocation not supported');
      setStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        await axios.post('http://localhost:5000/api/attendance', {
          lat: latitude,
          lng: longitude
        });
        setMsg('✅ Clocked In Successfully!');
        setStatus('success');
      } catch (error) {
        setMsg('Clock In Failed: ' + (error.response?.data?.message || error.message));
        setStatus('error');
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded shadow flex items-center justify-between mb-8 border-l-4 border-green-500">
      <div>
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FaClock className="text-green-600" /> Staff Attendance
        </h2>
        <p className="text-sm text-gray-500">Mark your daily presence in the kitchen.</p>
        {msg && <p className={`text-sm mt-2 font-bold ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      </div>
      <button 
        onClick={handleClockIn} 
        disabled={status === 'loading' || status === 'success'}
        className={`px-6 py-3 rounded text-white font-bold shadow-lg transition transform active:scale-95 flex items-center gap-2 ${status === 'success' ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
      >
        <FaMapMarkerAlt /> {status === 'loading' ? 'Locating...' : status === 'success' ? 'Present' : 'Clock In'}
      </button>
    </div>
  );
};

export default StaffAttendance;