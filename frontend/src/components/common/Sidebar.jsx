import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaUtensils, FaClipboardList, FaSignOutAlt, FaQrcode ,FaCarrot} from 'react-icons/fa'; // Ensure react-icons is installed

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path ? "bg-blue-700 text-white" : "text-blue-100 hover:bg-blue-600";

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ to, icon, label }) => (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 transition-colors ${isActive(to)}`}>
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="w-64 bg-blue-800 h-screen text-white flex flex-col fixed left-0 top-0 shadow-xl">
      <div className="p-6 border-b border-blue-700">
        <h1 className="text-2xl font-bold tracking-wider">SmartHostel</h1>
        <p className="text-blue-300 text-sm mt-1 capitalize">{user?.role} Portal</p>
      </div>

      <nav className="flex-1 mt-6">
        {/* STUDENT LINKS */}
        {user?.role === 'student' && (
          <>
            <NavItem to="/student" icon={<FaUtensils />} label="Meals & Booking" />
            <NavItem to="/student/attendance" icon={<FaQrcode />} label="Attendance & QR" />
          </>
        )}

        {/* STAFF LINKS */}
        {user?.role === 'staff' && (
          <>
            <NavItem to="/staff" icon={<FaUtensils />} label="Kitchen Management" />
            <NavItem to="/staff/inventory" icon={<FaCarrot />} label="Inventory" />
          </>
        )}

        {/* ADMIN LINKS */}
        {user?.role === 'admin' && (
          <>
            <NavItem to="/admin" icon={<FaUser />} label="User Management" />
          </>
        )}
      </nav>

      <div className="p-4 border-t border-blue-700">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-200 hover:bg-red-900/30 rounded transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;