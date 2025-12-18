import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFilter, FaPaperPlane, FaExclamationTriangle } from 'react-icons/fa';

const IssueResolution = () => {
  const [issues, setIssues] = useState([]);
  const [filterRoom, setFilterRoom] = useState('');
  const [response, setResponse] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);

  const fetchIssues = async () => {
    try {
      const url = filterRoom 
        ? `http://localhost:5000/api/issues?room=${filterRoom}` 
        : 'http://localhost:5000/api/issues';
      const res = await axios.get(url);
      setIssues(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchIssues(); }, [filterRoom]);

  const handleResolve = async (isWarning) => {
    if(!selectedIssue || !response) return alert("Write a response first");
    
    try {
      await axios.patch(`http://localhost:5000/api/issues/${selectedIssue}`, {
        status: isWarning ? 'open' : 'resolved', // Warnings might keep ticket open or resolve it.
        adminResponse: response,
        isWarning
      });
      alert(isWarning ? "Warning Sent!" : "Issue Resolved!");
      setResponse('');
      setSelectedIssue(null);
      fetchIssues();
    } catch (e) { alert("Action failed"); }
  };

  return (
    <div className="bg-white p-6 rounded shadow h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
            <FaExclamationTriangle className="text-orange-500" /> Issue Tracker
        </h2>
        <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <input 
                placeholder="Filter Room (e.g. 101)" 
                className="border p-1 rounded text-sm w-32"
                value={filterRoom} onChange={e => setFilterRoom(e.target.value)}
            />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {issues.map(issue => (
            <div key={issue._id} className={`p-4 rounded border-l-4 ${issue.status === 'resolved' ? 'border-green-500 bg-gray-50 opacity-70' : 'border-red-500 bg-white shadow-sm'}`}>
                <div className="flex justify-between">
                    <div>
                        <span className="font-bold text-gray-800">Room {issue.room}</span>
                        <span className="text-gray-500 text-xs ml-2">({issue.studentId?.name})</span>
                    </div>
                    <span className="text-xs font-bold uppercase">{issue.category}</span>
                </div>
                <p className="text-gray-700 text-sm mt-1 mb-2">"{issue.description}"</p>
                
                {issue.adminResponse ? (
                    <div className={`text-xs p-2 rounded ${issue.isWarning ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        <strong>Admin:</strong> {issue.adminResponse}
                    </div>
                ) : (
                    <div className="mt-2">
                        {selectedIssue === issue._id ? (
                            <div className="animate-fade-in">
                                <textarea 
                                    className="w-full border p-2 rounded text-sm mb-2" 
                                    placeholder="Write response or warning..."
                                    value={response} onChange={e => setResponse(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <button onClick={() => handleResolve(false)} className="bg-green-600 text-white px-3 py-1 rounded text-xs">Resolve</button>
                                    <button onClick={() => handleResolve(true)} className="bg-red-600 text-white px-3 py-1 rounded text-xs">⚠️ Issue Warning</button>
                                    <button onClick={() => setSelectedIssue(null)} className="text-gray-500 text-xs px-2">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => setSelectedIssue(issue._id)} className="text-blue-600 text-xs font-bold hover:underline">Reply / Take Action</button>
                        )}
                    </div>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};

export default IssueResolution;