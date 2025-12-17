import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFilter, FaStar, FaUserTag } from 'react-icons/fa';

const FeedbackAnalysis = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterRoom, setFilterRoom] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/feedback');
        setFeedbacks(data);
        setFiltered(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFeedback();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = feedbacks;
    if (filterCategory) {
        result = result.filter(f => f.category === filterCategory);
    }
    if (filterRoom) {
        // Assuming user object has room populated. Backend getAllFeedback needs to populate 'userId' with 'room'
        // We need to update backend controller to ensure room is sent.
        // For now, let's assume it is or check safely.
        result = result.filter(f => f.userId?.room?.toLowerCase().includes(filterRoom.toLowerCase()));
    }
    setFiltered(result);
  }, [filterRoom, filterCategory, feedbacks]);

  return (
    <div className="bg-white p-6 rounded shadow h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700">📢 Student Feedback Analysis</h2>
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">{filtered.length} Reports</span>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4 bg-gray-50 p-3 rounded border">
        <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <input 
                type="text" placeholder="Filter by Room..." 
                className="border p-1 rounded text-sm w-32"
                value={filterRoom} onChange={e => setFilterRoom(e.target.value)}
            />
        </div>
        <select 
            className="border p-1 rounded text-sm"
            value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
        >
            <option value="">All Categories</option>
            <option value="food">Food</option>
            <option value="hygiene">Hygiene</option>
            <option value="facility">Facility</option>
        </select>
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-[500px] space-y-3 pr-2">
        {filtered.map(fb => (
            <div key={fb._id} className="border rounded p-3 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            fb.category === 'food' ? 'bg-green-100 text-green-700' :
                            fb.category === 'hygiene' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                            {fb.category}
                        </span>
                        <div className="flex text-yellow-400 text-xs">
                             {[...Array(5)].map((_, i) => <FaStar key={i} className={i < fb.rating ? "" : "text-gray-300"} />)}
                        </div>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(fb.createdAt).toLocaleDateString()}</span>
                </div>
                
                <p className="text-gray-700 text-sm mt-2 font-medium">"{fb.comment}"</p>
                
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed">
                    <FaUserTag className="text-gray-400 text-xs" />
                    <span className="text-xs text-gray-600 font-bold">{fb.userId?.name || 'Anonymous'}</span>
                    {/* Note: Ensure backend User model has Room and Populate includes it */}
                    {fb.userId?.room && <span className="text-xs bg-gray-200 px-1 rounded">Room {fb.userId.room}</span>}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackAnalysis;