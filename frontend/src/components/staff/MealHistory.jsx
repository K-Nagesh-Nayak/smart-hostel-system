import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaSearch } from 'react-icons/fa';

const MealHistory = () => {
  const [history, setHistory] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // Reusing the existing meals endpoint. 
      // In a real app, you might want a dedicated /api/meals/history endpoint 
      // that supports range queries (startDate, endDate).
      const url = filterDate 
        ? `http://localhost:5000/api/meals?date=${filterDate}`
        : 'http://localhost:5000/api/meals'; 
        
      const { data } = await axios.get(url);
      
      // We also need stats for these meals to show "Total Booked"
      // This part is a bit heavy on requests (N+1 problem), typically backend should join this data.
      // For this project scale, we'll fetch stats for each unique date found.
      if (data.length > 0) {
        const uniqueDates = [...new Set(data.map(m => m.date))];
        let allStats = {};
        for (const date of uniqueDates) {
            const statRes = await axios.get(`http://localhost:5000/api/bookings/stats?date=${date}`);
            allStats = { ...allStats, ...statRes.data };
        }
        
        // Merge count into meal object
        const mealsWithStats = data.map(meal => ({
            ...meal,
            bookedCount: allStats[meal._id] || 0
        }));
        setHistory(mealsWithStats);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error("Error fetching history", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filterDate]); // Refetch when date changes

  return (
    <div className="bg-white p-6 rounded shadow border-t-4 border-blue-600">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FaCalendarAlt /> Meal Booking History
        </h2>
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Filter by Date:</span>
            <input 
                type="date" 
                className="border p-2 rounded text-sm"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
            />
            {filterDate && (
                <button 
                    onClick={() => setFilterDate('')}
                    className="text-sm text-blue-600 underline"
                >
                    Clear
                </button>
            )}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-10">Loading history...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Menu Items</th>
                <th className="px-4 py-3 text-center">Total Booked</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">No records found.</td>
                </tr>
              ) : (
                history.map((meal) => (
                  <tr key={meal._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{meal.date}</td>
                    <td className="px-4 py-3 capitalize">{meal.type}</td>
                    <td className="px-4 py-3 text-gray-600">{meal.items.join(', ')}</td>
                    <td className="px-4 py-3 text-center font-bold text-blue-700 text-lg">
                        {meal.bookedCount}
                    </td>
                    <td className="px-4 py-3 text-center">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Completed</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MealHistory;