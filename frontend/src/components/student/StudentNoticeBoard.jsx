import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBullhorn, FaExclamationCircle } from 'react-icons/fa';

const StudentNoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/notices');
        setNotices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow border-t-4 border-yellow-500 min-h-[400px]">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        <FaBullhorn className="text-yellow-500" /> Digital Notice Board
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading announcements...</p>
      ) : (
        <div className="space-y-4">
          {notices.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded">
                <p className="text-gray-400 italic">No active notices at this time.</p>
            </div>
          ) : notices.map(notice => (
            <div key={notice._id} className={`p-4 rounded border-l-4 shadow-sm transition hover:shadow-md ${
                notice.priority === 'emergency' ? 'bg-red-50 border-red-500' : 
                notice.priority === 'high' ? 'bg-orange-50 border-orange-400' : 'bg-blue-50 border-blue-400'
            }`}>
                <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-bold text-lg ${
                        notice.priority === 'emergency' ? 'text-red-700' : 'text-gray-800'
                    }`}>
                        {notice.priority === 'emergency' && <FaExclamationCircle className="inline mr-2" />}
                        {notice.title}
                    </h3>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                        {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{notice.content}</p>
                
                {notice.priority !== 'normal' && (
                    <div className="mt-3">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded text-white ${
                            notice.priority === 'emergency' ? 'bg-red-500' : 'bg-orange-500'
                        }`}>
                            {notice.priority} Priority
                        </span>
                    </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentNoticeBoard;