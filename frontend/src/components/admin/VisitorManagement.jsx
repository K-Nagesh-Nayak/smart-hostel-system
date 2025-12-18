import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserClock, FaSignOutAlt, FaHistory, FaPlus, FaSearch } from 'react-icons/fa';

const VisitorManagement = () => {
  const [visitors, setVisitors] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', purpose: '', visitingStudent: '' });
  const [msg, setMsg] = useState('');

  const fetchVisitors = async () => {
    try {
      const endpoint = activeTab === 'active' 
        ? 'http://localhost:5000/api/visitors/active' 
        : 'http://localhost:5000/api/visitors/history';
      const { data } = await axios.get(endpoint);
      setVisitors(data);
    } catch (error) {
      console.error("Error fetching visitors", error);
    }
  };

  useEffect(() => { fetchVisitors(); }, [activeTab]);

  const handleEntry = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/visitors/entry', formData);
      setMsg('Visitor Logged Successfully');
      setShowForm(false);
      setFormData({ name: '', phone: '', purpose: '', visitingStudent: '' });
      fetchVisitors();
      setTimeout(() => setMsg(''), 3000);
    } catch (error) {
      setMsg('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleExit = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/visitors/${id}/exit`);
      fetchVisitors(); // Refresh list
    } catch (error) {
      console.error("Exit failed", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow border-t-4 border-purple-600 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaUserClock /> Visitor Log
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('active')} 
            className={`px-3 py-1 rounded text-sm font-bold ${activeTab === 'active' ? 'bg-purple-100 text-purple-700' : 'text-gray-500'}`}
          >
            Active
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={`px-3 py-1 rounded text-sm font-bold ${activeTab === 'history' ? 'bg-purple-100 text-purple-700' : 'text-gray-500'}`}
          >
            History
          </button>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="ml-2 bg-purple-600 text-white px-3 py-1 rounded text-sm font-bold flex items-center gap-1 hover:bg-purple-700"
          >
            <FaPlus /> New Entry
          </button>
        </div>
      </div>

      {msg && <div className="mb-4 p-2 bg-blue-50 text-blue-700 text-sm rounded">{msg}</div>}

      {/* Entry Form */}
      {showForm && (
        <form onSubmit={handleEntry} className="mb-6 p-4 bg-gray-50 rounded border border-gray-200 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input 
              placeholder="Visitor Name" required 
              className="border p-2 rounded text-sm"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            />
            <input 
              placeholder="Phone Number" required 
              className="border p-2 rounded text-sm"
              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
            />
            <input 
              placeholder="Purpose / Student Name" required 
              className="border p-2 rounded text-sm"
              value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})}
            />
            <button className="bg-purple-600 text-white rounded font-bold text-sm">Log Entry</button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Check In</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {visitors.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-gray-400">No records found.</td></tr>
            ) : visitors.map(v => (
              <tr key={v._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{v.name}</td>
                <td className="px-4 py-3 text-gray-500">{v.phone}</td>
                <td className="px-4 py-3">{v.purpose}</td>
                <td className="px-4 py-3 text-gray-500">
                    {new Date(v.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    <span className="block text-xs">{new Date(v.checkInTime).toLocaleDateString()}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  {v.status === 'active' ? (
                    <button 
                        onClick={() => handleExit(v._id)}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded text-xs font-bold hover:bg-red-200 flex items-center gap-1 ml-auto"
                    >
                        <FaSignOutAlt /> Check Out
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs">
                        Out: {new Date(v.checkOutTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisitorManagement;