import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { useState } from 'react';

const Header = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);

  // Mock notifications for now (Backend model exists, can wire up API later)
  const notifications = [
    { id: 1, text: "Low stock alert: Rice (2kg remaining)", time: "10m ago", type: "alert" },
    { id: 2, text: "New Leave Request: Student One", time: "1h ago", type: "info" }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white text-gray-800 p-4 flex justify-between items-center shadow-sm border-b sticky top-0 z-50">
      <h1 className="text-xl font-bold text-blue-800 ml-4">{title || 'Smart Hostel'}</h1>
      
      <div className="flex items-center gap-6 mr-4">
        {/* Notification Bell */}
        <div className="relative">
          <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 text-gray-600 hover:text-blue-600 transition">
            <FaBell size={20} />
            <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2 animate-ping"></span>
          </button>
          
          {/* Dropdown */}
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow-xl z-50 animate-fade-in">
              <div className="p-3 border-b bg-gray-50 font-bold text-sm">Notifications</div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`p-3 border-b text-sm ${n.type === 'alert' ? 'bg-red-50 text-red-800' : 'hover:bg-gray-50'}`}>
                    <p>{n.text}</p>
                    <span className="text-xs text-gray-400 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded text-sm font-bold"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;