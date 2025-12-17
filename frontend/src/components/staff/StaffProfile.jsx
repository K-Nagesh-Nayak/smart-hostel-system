import { useAuth } from '../../contexts/AuthContext';
import { FaUserCircle, FaEnvelope, FaIdBadge } from 'react-icons/fa';

const StaffProfile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-lg border-t-4 border-blue-600 mt-10">
      <div className="flex flex-col items-center mb-8">
        <FaUserCircle className="text-gray-300 text-9xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold capitalize mt-2">
            {user?.role} Member
        </span>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded border">
            <div className="bg-blue-500 p-3 rounded-full text-white">
                <FaEnvelope />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-bold uppercase">Email Address</p>
                <p className="text-gray-800 font-medium">{user?.email}</p>
            </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded border">
            <div className="bg-purple-500 p-3 rounded-full text-white">
                <FaIdBadge />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-bold uppercase">System ID</p>
                <p className="text-gray-800 font-medium font-mono text-sm">{user?._id}</p>
            </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-400">
        Account Status: <span className="text-green-500 font-bold">Active</span>
      </div>
    </div>
  );
};

export default StaffProfile;