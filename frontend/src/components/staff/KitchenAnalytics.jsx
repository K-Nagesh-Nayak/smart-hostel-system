import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const KitchenAnalytics = () => {
  const [feedbackStats, setFeedbackStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/feedback/stats');
        // Format data for Recharts: [{ name: 'Food', value: 4.5 }]
        const formatted = data.map(item => ({
          name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
          rating: Number(item.avgRating.toFixed(1)),
          count: item.count
        }));
        setFeedbackStats(formatted);
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    fetchStats();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
      {/* Chart 1: Average Ratings */}
      <div className="bg-white p-6 rounded shadow border-t-4 border-blue-500">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Feedback Ratings (Avg)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={feedbackStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="rating" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Feedback Volume */}
      <div className="bg-white p-6 rounded shadow border-t-4 border-purple-500">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Feedback Volume by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={feedbackStats}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label
              >
                {feedbackStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default KitchenAnalytics;