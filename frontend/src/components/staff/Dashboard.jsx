import { useState } from 'react';
import Layout from '../common/Layout';
import MealManagement from './MealManagement';
import GroceryManagement from './GroceryManagement';
import StaffAttendance from './StaffAttendance';
import KitchenAnalytics from './KitchenAnalytics';
import FeedbackList from './FeedbackList';
import QRScanner from './QRScanner';
import MealHistory from './MealHistory';
import StaffProfile from './StaffProfile';
// FIX: Changed Facolumns to FaThLarge
import { FaThLarge, FaHistory, FaCommentDots, FaUser } from 'react-icons/fa';

const StaffDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'feedback', 'history', 'profile'

  const TabButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveView(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        activeView === id 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-blue-600'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6 pb-10">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 uppercase">Staff Portal</h1>
          
          <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-xl">
            {/* FIX: Icon usage updated here */}
            <TabButton id="dashboard" label="Dashboard" icon={<FaThLarge />} />
            <TabButton id="feedback" label="All Feedback" icon={<FaCommentDots />} />
            <TabButton id="history" label="Meal History" icon={<FaHistory />} />
            <TabButton id="profile" label="Profile" icon={<FaUser />} />
          </div>
        </div>

        {/* --- VIEW 1: MAIN DASHBOARD --- */}
        {activeView === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Operational Essentials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StaffAttendance />
              <QRScanner />
            </div>

            {/* Insights Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                 <KitchenAnalytics />
              </div>
              <div>
                 {/* Show only latest 5 on dashboard */}
                 <FeedbackList limit={5} title="Latest Feedback" />
              </div>
            </div>

            {/* Management Modules */}
            <div className="space-y-8">
              <MealManagement />
              <GroceryManagement />
            </div>
          </div>
        )}

        {/* --- VIEW 2: ALL FEEDBACK --- */}
        {activeView === 'feedback' && (
          <div className="animate-fade-in">
             <FeedbackList limit={0} title="All Student Feedback" />
          </div>
        )}

        {/* --- VIEW 3: MEAL HISTORY --- */}
        {activeView === 'history' && (
          <div className="animate-fade-in">
            <MealHistory />
          </div>
        )}

        {/* --- VIEW 4: PROFILE --- */}
        {activeView === 'profile' && (
          <div className="animate-fade-in">
            <StaffProfile />
          </div>
        )}

      </div>
    </Layout>
  );
};

export default StaffDashboard;