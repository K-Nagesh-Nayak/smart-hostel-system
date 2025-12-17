import { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users on component load
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

  // Handle Approve Button Click
  const handleApprove = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/${id}/approve`);
      // Refresh list locally after approval
      setUsers(users.map(user => user._id === id ? { ...user, approved: true } : user));
    } catch (error) {
      alert("Failed to approve user");
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-2">
                  {user.approved ? (
                    <span className="text-green-600 font-semibold text-sm bg-green-100 px-2 py-1 rounded">Approved</span>
                  ) : (
                    <span className="text-red-600 font-semibold text-sm bg-red-100 px-2 py-1 rounded">Pending</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {!user.approved && user.role === 'student' && (
                    <button
                      onClick={() => handleApprove(user._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;