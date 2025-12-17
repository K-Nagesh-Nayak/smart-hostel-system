import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBullhorn, FaTrash, FaExclamationCircle } from 'react-icons/fa';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState({ title: '', content: '', priority: 'normal' });

  const fetchNotices = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/notices');
      setNotices(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchNotices(); }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/notices', newNotice);
      alert("Notice Posted!");
      setNewNotice({ title: '', content: '', priority: 'normal' });
      fetchNotices();
    } catch (error) {
      alert("Failed to post notice");
    }
  };

  const handleDelete = async (id) => {
    if(confirm("Delete this notice?")) {
        try {
            await axios.delete(`http://localhost:5000/api/notices/${id}`);
            fetchNotices();
        } catch(e) { alert("Failed to delete"); }
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow border-t-4 border-yellow-500 h-full">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FaBullhorn /> Notice Board
      </h2>

      {/* Post Form */}
      <form onSubmit={handlePost} className="bg-yellow-50 p-4 rounded mb-6 border border-yellow-200">
        <div className="space-y-3">
            <input 
                type="text" placeholder="Notice Title" required 
                className="w-full border p-2 rounded text-sm font-bold"
                value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})}
            />
            <textarea 
                placeholder="Details..." required 
                className="w-full border p-2 rounded text-sm h-20"
                value={newNotice.content} onChange={e => setNewNotice({...newNotice, content: e.target.value})}
            ></textarea>
            <div className="flex justify-between items-center">
                <select 
                    className="border p-1 rounded text-sm"
                    value={newNotice.priority} onChange={e => setNewNotice({...newNotice, priority: e.target.value})}
                >
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority</option>
                    <option value="emergency">Emergency</option>
                </select>
                <button type="submit" className="bg-yellow-600 text-white px-4 py-1 rounded text-sm font-bold hover:bg-yellow-700">
                    Post Notice
                </button>
            </div>
        </div>
      </form>

      {/* List */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {notices.length === 0 ? <p className="text-gray-400 text-sm italic">No active notices.</p> : notices.map(notice => (
            <div key={notice._id} className={`p-3 rounded border relative ${
                notice.priority === 'emergency' ? 'bg-red-100 border-red-300' : 
                notice.priority === 'high' ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'
            }`}>
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800 text-sm">{notice.title}</h3>
                    <button onClick={() => handleDelete(notice._id)} className="text-red-400 hover:text-red-600"><FaTrash size={12} /></button>
                </div>
                <p className="text-gray-600 text-xs mt-1">{notice.content}</p>
                <span className="text-[10px] text-gray-400 mt-2 block">{new Date(notice.createdAt).toLocaleString()}</span>
                {notice.priority === 'emergency' && <FaExclamationCircle className="absolute top-2 right-8 text-red-500 animate-pulse" />}
            </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeBoard;