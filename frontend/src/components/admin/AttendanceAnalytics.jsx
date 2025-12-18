import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarCheck, FaUserClock, FaChartBar } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const AttendanceAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // We'll reuse the main stats endpoint or creating a dedicated one is better
        // For now, assume dashboard stats gives us what we need or we fetch specific
        const { data } = await axios.get('http://localhost:5000/api/admin/stats');
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Analytics...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 flex items-center gap-2">
        <FaChartBar className="text-blue-600" /> Attendance Analytics
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-500 text-sm font-bold uppercase">Present Today</p>
                    <p className="text-4xl font-bold text-gray-800">{stats?.presentCount}</p>
                </div>
                <FaCalendarCheck className="text-green-200 text-5xl" />
            </div>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-red-500">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-500 text-sm font-bold uppercase">Absent Today</p>
                    <p className="text-4xl font-bold text-gray-800">{stats?.absentCount}</p>
                </div>
                <FaUserClock className="text-red-200 text-5xl" />
            </div>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-500 text-sm font-bold uppercase">Total Students</p>
                    <p className="text-4xl font-bold text-gray-800">{stats?.totalStudents}</p>
                </div>
                <div className="text-blue-200 text-5xl font-bold">%</div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
                {Math.round((stats?.presentCount / stats?.totalStudents) * 100) || 0}% Attendance Rate
            </p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded shadow h-[400px]">
        <h3 className="text-lg font-bold text-gray-700 mb-6">Weekly Attendance Trend</h3>
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar name="Students Present" dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
            </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Future Scope: List of all students with their individual % */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Detailed Student Reports</h3>
        <p className="text-gray-500 italic">Individual student attendance logs coming soon in Phase 6...</p>
      </div>
    </div>
  );
};

export default AttendanceAnalytics;