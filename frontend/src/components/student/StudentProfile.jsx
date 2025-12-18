import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { FaUserCircle, FaKey, FaIdCard, FaEnvelope, FaPhone, FaBed } from 'react-icons/fa';

const StudentProfile = () => {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setMsg({ text: "New passwords do not match", type: "error" });
      return;
    }

    try {
      await axios.put('http://localhost:5000/api/auth/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      setMsg({ text: "Password changed successfully!", type: "success" });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      setMsg({ text: error.response?.data?.message || "Failed to update password", type: "error" });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
      {/* Profile Details Card */}
      <div className="bg-white p-6 rounded shadow border-t-4 border-blue-500">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaUserCircle /> My Profile
        </h2>
        
        <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                <FaIdCard className="text-blue-500" />
                <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Full Name</p>
                    <p className="font-medium text-gray-800">{user?.name}</p>
                </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                <FaEnvelope className="text-blue-500" />
                <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Email</p>
                    <p className="font-medium text-gray-800">{user?.email}</p>
                </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                <FaBed className="text-blue-500" />
                <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Room Number</p>
                    <p className="font-medium text-gray-800">{user?.room || 'Not Assigned'}</p>
                     {console.log(user)}
                </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                <FaPhone className="text-blue-500" />
                <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Phone</p>
                    <p className="font-medium text-gray-800">{user?.phone || 'N/A'}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white p-6 rounded shadow border-t-4 border-purple-500">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaKey /> Security
        </h2>

        {msg.text && (
            <div className={`p-3 rounded mb-4 text-sm font-bold ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {msg.text}
            </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Current Password</label>
                <input 
                    type="password" required className="w-full border p-2 rounded"
                    value={passwords.current}
                    onChange={e => setPasswords({...passwords, current: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">New Password</label>
                <input 
                    type="password" required className="w-full border p-2 rounded"
                    value={passwords.new}
                    onChange={e => setPasswords({...passwords, new: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Confirm New Password</label>
                <input 
                    type="password" required className="w-full border p-2 rounded"
                    value={passwords.confirm}
                    onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                />
            </div>
            <button type="submit" className="w-full bg-purple-600 text-white font-bold py-2 rounded hover:bg-purple-700 transition">
                Update Password
            </button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;