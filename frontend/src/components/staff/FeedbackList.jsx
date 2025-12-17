import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCommentDots, FaStar } from 'react-icons/fa';

const FeedbackList = ({ limit = 0, title = "Recent Student Feedback" }) => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/feedback');
        setFeedbacks(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFeedback();
  }, []);

  // Filter if limit is set
  const displayFeedbacks = limit > 0 ? feedbacks.slice(0, limit) : feedbacks;

  return (
    <div className="bg-white p-6 rounded shadow border-t-4 border-orange-500 h-full">
      <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
        <FaCommentDots /> {title}
      </h3>
      <div className={`space-y-4 overflow-y-auto pr-2 ${limit > 0 ? 'max-h-96' : ''}`}>
        {displayFeedbacks.length === 0 ? <p className="text-gray-500">No feedback yet.</p> : displayFeedbacks.map((fb) => (
          <div key={fb._id} className="p-3 bg-gray-50 rounded border border-gray-100">
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-xs uppercase bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {fb.category}
              </span>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < fb.rating ? "text-yellow-400" : "text-gray-300"} size={12} />
                ))}
              </div>
            </div>
            <p className="text-gray-700 text-sm mt-2">"{fb.comment}"</p>
            <p className="text-xs text-gray-400 mt-2 text-right">
              - {fb.userId?.name || 'Anonymous'}, {new Date(fb.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;