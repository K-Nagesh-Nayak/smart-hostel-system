import Layout from '../common/Layout';
import UserManagement from './UserManagement';
import GeoSettings from './GeoSettings';
import NoticeBoard from './NoticeBoard'; // <-- Import
import FeedbackAnalysis from './FeedbackAnalysis'; // <-- Import
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserPlus, FaUsers, FaUtensils, FaUserCheck, FaMapMarkedAlt, FaChartLine } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); 
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', password: 'password123', room: '' });

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/admin/stats');
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats", error);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/add-student', newStudent);
      alert("✅ Student Added Successfully!");
      setShowAddStudent(false);
      setNewStudent({ name: '', email: '', password: 'password123', room: '' });
      fetchStats();
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Admin Command Center</h1>
          <div className="bg-gray-100 p-1 rounded-lg flex flex-wrap gap-1">
            {['overview', 'users', 'map', 'communication'].map(tab => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)} 
                    className={`px-4 py-2 rounded-md font-bold capitalize transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                    {tab}
                </button>
            ))}
          </div>
        </div>

        {/* --- VIEW 1: OVERVIEW --- */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick Actions */}
            <div className="flex justify-end">
                <button onClick={() => setShowAddStudent(true)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition font-bold">
                    <FaUserPlus /> Add New Student
                </button>
            </div>

            {/* Modal for Add Student */}
            {showAddStudent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Add New Student</h3>
                        <form onSubmit={handleAddStudent} className="space-y-3">
                            <input type="text" placeholder="Full Name" required className="w-full border p-2 rounded" onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                            <input type="email" placeholder="Email" required className="w-full border p-2 rounded" onChange={e => setNewStudent({...newStudent, email: e.target.value})} />
                            <input type="text" placeholder="Room Number" required className="w-full border p-2 rounded" onChange={e => setNewStudent({...newStudent, room: e.target.value})} />
                            <div className="bg-gray-100 p-2 rounded text-xs text-gray-500">Default Password: <strong>password123</strong></div>
                            <div className="flex gap-2 mt-4">
                                <button type="button" onClick={() => setShowAddStudent(false)} className="flex-1 bg-gray-300 py-2 rounded font-bold hover:bg-gray-400">Cancel</button>
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                  { label: 'Total Students', val: stats.totalStudents, icon: <FaUsers />, color: 'blue' },
                  { label: 'Meals Today', val: stats.mealBookings, icon: <FaUtensils />, color: 'orange' },
                  { label: 'Present Today', val: stats.presentCount, icon: <FaUserCheck />, color: 'green' },
                  { label: 'Absentees', val: stats.absentCount, icon: <FaMapMarkedAlt />, color: 'red' },
              ].map((item, i) => (
                  <div key={i} className={`bg-white p-6 rounded shadow border-l-4 border-${item.color}-500`}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{item.label}</p>
                            <p className="text-3xl font-bold text-gray-800">{item.val}</p>
                        </div>
                        <div className={`text-${item.color}-200 text-4xl`}>{item.icon}</div>
                    </div>
                  </div>
              ))}
            </div>

            {/* Row 2: Graph & Absentee List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded shadow border-t-4 border-blue-500">
                    <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2"><FaChartLine /> Attendance Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.attendanceTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{fontSize: 10}} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-6 rounded shadow border-t-4 border-red-500">
                    <h3 className="text-lg font-bold text-red-600 mb-4">🔴 Absent Today</h3>
                    <div className="overflow-y-auto max-h-64 space-y-2 pr-2">
                        {stats.absentees.length === 0 ? <p className="text-green-600 font-bold text-center">Everyone Present!</p> : stats.absentees.map(s => (
                            <div key={s._id} className="p-3 bg-red-50 rounded border border-red-100 flex justify-between"><span className="font-bold">{s.name}</span><span className="text-xs bg-white px-2 py-1 rounded">Room {s.room}</span></div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* --- VIEW 2: USERS --- */}
        {activeTab === 'users' && <UserManagement />}

        {/* --- VIEW 3: GEO MAP --- */}
        {activeTab === 'map' && <div className="h-[600px]"><GeoSettings /></div>}

        {/* --- VIEW 4: COMMUNICATION (NEW) --- */}
        {activeTab === 'communication' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">
                <NoticeBoard />
                <FeedbackAnalysis />
            </div>
        )}

      </div>
    </Layout>
  );
};

export default AdminDashboard;