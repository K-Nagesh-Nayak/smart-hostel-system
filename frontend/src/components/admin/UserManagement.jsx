import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaBan, FaHistory, FaCheck, FaTimes } from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // For Detail Modal
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/users');
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Approve
  const handleApprove = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${id}/approve`);
      setUsers(users.map(user => user._id === id ? { ...user, approved: true } : user));
    } catch (error) {
      alert("Failed to approve user");
    }
  };

  // Handle Revoke Access
  const handleRevoke = async (id) => {
    if(!confirm("Are you sure you want to revoke this user's access? They won't be able to login.")) return;
    try {
        await axios.patch(`http://localhost:5000/api/admin/users/${id}/revoke`);
        alert("Access Revoked!");
        // Update local state
        setUsers(users.map(user => user._id === id ? { ...user, approved: false } : user));
        if(selectedUser && selectedUser._id === id) {
            setSelectedUser({...selectedUser, approved: false});
        }
    } catch (error) {
        alert("Failed to revoke access: " + (error.response?.data?.message || "Server Error"));
    }
  };

  // Open Modal
  const openDetails = (user) => {
    setSelectedUser(user);
    setFormData({ ...user });
    setEditMode(false);
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.put(`http://localhost:5000/api/admin/users/${selectedUser._id}`, {
            name: formData.name,
            room: formData.room,
            phone: formData.phone
        });
        
        alert("User details updated!");
        setEditMode(false);
        // Refresh full list to show updates
        fetchUsers(); 
        // Update modal view
        setSelectedUser(res.data.user);
    } catch (error) {
        alert("Update failed: " + (error.response?.data?.message || "Server Error"));
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      
      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Room</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-bold">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-2">{user.room || 'N/A'}</td>
                <td className="px-4 py-2">
                  {user.approved ? (
                    <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-xs">Active</span>
                  ) : (
                    <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-xs">Revoked/Pending</span>
                  )}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  {!user.approved && user.role === 'student' && (
                    <button onClick={() => handleApprove(user._id)} className="text-green-600 hover:text-green-800" title="Approve">
                        <FaCheck />
                    </button>
                  )}
                  <button onClick={() => openDetails(user)} className="text-blue-600 hover:text-blue-800" title="Manage">
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white p-6 rounded-lg w-[500px] shadow-2xl relative">
                <button 
                    onClick={() => setSelectedUser(null)} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <FaTimes />
                </button>

                <h3 className="text-xl font-bold mb-6 border-b pb-2">Student Details</h3>

                {!editMode ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs text-gray-500 font-bold uppercase">Name</label><p>{selectedUser.name}</p></div>
                            <div><label className="text-xs text-gray-500 font-bold uppercase">Role</label><p className="capitalize">{selectedUser.role}</p></div>
                            <div><label className="text-xs text-gray-500 font-bold uppercase">Email</label><p>{selectedUser.email}</p></div>
                            <div><label className="text-xs text-gray-500 font-bold uppercase">Phone</label><p>{selectedUser.phone || 'N/A'}</p></div>
                            <div><label className="text-xs text-gray-500 font-bold uppercase">Room</label><p>{selectedUser.room || 'N/A'}</p></div>
                            <div><label className="text-xs text-gray-500 font-bold uppercase">Status</label>
                                <p className={selectedUser.approved ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                    {selectedUser.approved ? "Active" : "Revoked"}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6 pt-4 border-t">
                            <button 
                                onClick={() => setEditMode(true)}
                                className="flex-1 bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700"
                            >
                                Edit Details
                            </button>
                            {selectedUser.approved ? (
                                <button 
                                    onClick={() => handleRevoke(selectedUser._id)}
                                    className="flex-1 bg-red-100 text-red-600 py-2 rounded font-bold hover:bg-red-200 border border-red-200"
                                >
                                    Revoke Access
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handleApprove(selectedUser._id)} // Reuse existing approve logic
                                    className="flex-1 bg-green-100 text-green-600 py-2 rounded font-bold hover:bg-green-200 border border-green-200"
                                >
                                    Restore Access
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold">Name</label>
                                <input className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs font-bold">Email</label>
                                <input className="w-full border p-2 rounded bg-gray-100 text-gray-500" value={formData.email} disabled />
                            </div>
                            <div>
                                <label className="text-xs font-bold">Room</label>
                                <input className="w-full border p-2 rounded" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs font-bold">Phone</label>
                                <input className="w-full border p-2 rounded" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button type="button" onClick={() => setEditMode(false)} className="flex-1 bg-gray-300 py-2 rounded">Cancel</button>
                            <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded">Save Changes</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;