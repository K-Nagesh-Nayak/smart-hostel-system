import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaCalendarAlt } from 'react-icons/fa';

const LeaveApproval = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/leaves/pending');
      setLeaves(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleAction = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/leaves/${id}/status`, { status });
      // Remove from list locally
      setLeaves(leaves.filter(l => l._id !== id));
    } catch (error) {
      alert("Action failed");
    }
  };

  if (loading) return <div className="p-4 text-gray-500">Loading pending requests...</div>;

  return (
    <div className="bg-white p-6 rounded shadow border-t-4 border-pink-600 h-full">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FaCalendarAlt /> Pending Leave Requests
      </h2>

      <div className="space-y-4">
        {leaves.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded border border-dashed">
                <p className="text-gray-400">No pending requests.</p>
            </div>
        ) : leaves.map(leave => (
            <div key={leave._id} className="p-4 border rounded shadow-sm hover:shadow-md transition bg-pink-50 border-pink-100">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-gray-800">{leave.studentId?.name}</h3>
                        <p className="text-xs text-gray-500">Room: {leave.studentId?.room || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold bg-white px-2 py-1 rounded border">
                            {new Date(leave.startDate).toLocaleDateString()} ➜ {new Date(leave.endDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-4 bg-white p-2 rounded border border-gray-100 italic">
                    "{leave.reason}"
                </p>

                <div className="flex gap-2">
                    <button 
                        onClick={() => handleAction(leave._id, 'approved')}
                        className="flex-1 bg-green-600 text-white py-1.5 rounded text-sm font-bold hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                        <FaCheck /> Approve
                    </button>
                    <button 
                        onClick={() => handleAction(leave._id, 'rejected')}
                        className="flex-1 bg-red-100 text-red-700 py-1.5 rounded text-sm font-bold hover:bg-red-200 flex items-center justify-center gap-2 border border-red-200"
                    >
                        <FaTimes /> Reject
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveApproval;