import { useState } from 'react';
import axios from 'axios';

const AttendancePanel = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleMarkAttendance = () => {
    setLoading(true);
    setMessage('');
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          await axios.post('http://localhost:5000/api/attendance', {
            lat: latitude,
            lng: longitude
          });

          setMessage('✅ Attendance Marked Successfully!');
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to mark attendance');
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        setError('Location permission denied. Please enable GPS.');
        setLoading(false);
      }
    );
  };

  return (
    <div className="bg-white p-6 rounded shadow-md border-t-4 border-blue-500 mb-6">
      <h2 className="text-xl font-bold mb-4">Smart Attendance</h2>
      
      <p className="text-gray-600 mb-4 text-sm">
        Click below to verify your location and mark attendance.
        You must be within 100m of the hostel.
      </p>

      {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-3">{message}</div>}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-3">{error}</div>}

      <button
        onClick={handleMarkAttendance}
        disabled={loading}
        className={`w-full py-2 rounded font-bold text-white transition ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Locating...' : '📍 Mark My Attendance'}
      </button>
    </div>
  );
};

export default AttendancePanel;