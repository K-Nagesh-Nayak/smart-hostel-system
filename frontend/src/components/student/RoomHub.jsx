import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { FaPaperPlane, FaExclamationTriangle, FaComments, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const RoomHub = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'issues'
  
  // Chat State
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  // Issue State
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({ category: 'maintenance', description: '' });

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      if (activeTab === 'chat') {
        const res = await axios.get('http://localhost:5000/api/issues/chat');
        setMessages(res.data);
      } else {
        const res = await axios.get('http://localhost:5000/api/issues');
        setIssues(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Poll for chat updates every 5 seconds (Simple "Real-time")
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, [activeTab]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- HANDLERS ---
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/issues/chat', { message: newMessage });
      setNewMessage('');
      fetchData();
    } catch (e) { alert("Failed to send"); }
  };

  const reportIssue = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/issues', newIssue);
      alert("Issue Reported");
      setNewIssue({ category: 'maintenance', description: '' });
      fetchData();
    } catch (e) { alert("Failed to report"); }
  };

  if (!user.room) return <div className="p-6 bg-red-100 text-red-700 rounded">You are not assigned a room yet.</div>;

  return (
    <div className="bg-white rounded shadow-lg overflow-hidden h-[500px] flex flex-col border-t-4 border-indigo-600">
      
      {/* Header Tabs */}
      <div className="flex border-b">
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex-1 p-4 font-bold flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <FaComments /> Room {user.room} Chat
        </button>
        <button 
          onClick={() => setActiveTab('issues')}
          className={`flex-1 p-4 font-bold flex items-center justify-center gap-2 ${activeTab === 'issues' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <FaExclamationTriangle /> Report Issues
        </button>
      </div>

      {/* --- CHAT VIEW --- */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col bg-gray-50">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && <p className="text-center text-gray-400 text-sm mt-10">Start the conversation with your roommates!</p>}
            {messages.map(msg => {
              const isMe = msg.senderId._id === user._id;
              return (
                <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-lg p-3 text-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border rounded-bl-none'}`}>
                    {!isMe && <p className="text-xs font-bold text-indigo-600 mb-1">{msg.senderId.name}</p>}
                    <p>{msg.message}</p>
                    <p className={`text-[10px] text-right mt-1 ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendMessage} className="p-3 bg-white border-t flex gap-2">
            <input 
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Message your roommates..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
            />
            <button type="submit" className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}

      {/* --- ISSUES VIEW --- */}
      {activeTab === 'issues' && (
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          {/* Form */}
          <form onSubmit={reportIssue} className="mb-8 p-4 bg-red-50 rounded border border-red-100">
            <h3 className="font-bold text-red-800 mb-3 text-sm uppercase">Report New Issue</h3>
            <div className="flex gap-2 mb-2">
              <select 
                className="border p-2 rounded text-sm bg-white"
                value={newIssue.category} onChange={e => setNewIssue({...newIssue, category: e.target.value})}
              >
                <option value="maintenance">Maintenance (Fan/Light)</option>
                <option value="cleanliness">Cleanliness</option>
                <option value="noise">Noise Complaint</option>
                <option value="other">Other</option>
              </select>
              <input 
                className="flex-1 border p-2 rounded text-sm"
                placeholder="Describe the issue..."
                required
                value={newIssue.description} onChange={e => setNewIssue({...newIssue, description: e.target.value})}
              />
              <button className="bg-red-600 text-white px-4 py-2 rounded text-sm font-bold">Report</button>
            </div>
          </form>

          {/* List */}
          <div className="space-y-3">
             <h3 className="font-bold text-gray-700 text-sm uppercase mb-2">My Reports</h3>
             {issues.map(issue => (
               <div key={issue._id} className="border rounded p-3 bg-white shadow-sm">
                 <div className="flex justify-between">
                    <span className="font-bold text-gray-800 text-sm capitalize">{issue.category} Issue</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      issue.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{issue.status}</span>
                 </div>
                 <p className="text-gray-600 text-sm mt-1">{issue.description}</p>
                 
                 {/* Admin Response Section */}
                 {issue.adminResponse && (
                   <div className={`mt-3 p-2 rounded text-sm flex items-start gap-2 ${issue.isWarning ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-blue-50 text-blue-800'}`}>
                      {issue.isWarning ? <FaExclamationCircle className="mt-1" /> : <FaCheckCircle className="mt-1" />}
                      <div>
                        <p className="font-bold text-xs uppercase">{issue.isWarning ? '⚠️ Admin Warning' : 'Admin Response'}</p>
                        <p>{issue.adminResponse}</p>
                      </div>
                   </div>
                 )}
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomHub;