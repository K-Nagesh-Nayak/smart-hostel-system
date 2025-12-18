import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarPlus, FaSuitcase } from 'react-icons/fa';

const LeaveRequest = () => {
  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState({ startDate: '', endDate: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchLeaves = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/leaves/my');
      setLeaves(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await axios.post('http://localhost:5000/api/leaves', formData);
      setMsg({ type: 'success', text: 'Leave Request Submitted!' });
      setFormData({ startDate: '', endDate: '', reason: '' });
      fetchLeaves();
    } catch (error) {
      setMsg({ type: 'error', text: 'Failed to submit request' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      
      {/* Request Form */}
      <div className="bg-white p-6 rounded shadow border-t-4 border-pink-500">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
            <FaCalendarPlus className="text-pink-500" /> Apply for Leave
        </h2>
        
        {msg && (
            <div className={`p-3 rounded mb-4 text-sm font-bold ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {msg.text}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">From</label>
                    <input 
                        type="date" required className="w-full border p-2 rounded"
                        value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})}
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">To</label>
                    <input 
                        type="date" required className="w-full border p-2 rounded"
                        value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})}
                    />
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Reason</label>
                <textarea 
                    required className="w-full border p-2 rounded h-24" placeholder="Going home for..."
                    value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}
                ></textarea>
            </div>
            <button disabled={loading} className="w-full bg-pink-600 text-white py-2 rounded font-bold hover:bg-pink-700 transition">
                {loading ? 'Submitting...' : 'Submit Request'}
            </button>
        </form>
      </div>

      {/* My Leaves History */}
      <div className="bg-white p-6 rounded shadow border-t-4 border-gray-500 h-[400px] overflow-hidden flex flex-col">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
            <FaSuitcase className="text-gray-500" /> My History
        </h2>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {leaves.length === 0 ? <p className="text-gray-400 italic">No leave history.</p> : leaves.map(leave => (
                <div key={leave._id} className="border p-3 rounded bg-gray-50">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-gray-800 text-sm">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-500 mt-1">{leave.reason}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                            leave.status === 'approved' ? 'bg-green-100 text-green-700' :
                            leave.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                            {leave.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;