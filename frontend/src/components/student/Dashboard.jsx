import { useState } from 'react';
import Layout from '../common/Layout';
import MealView from './MealView';
import AttendancePanel from './AttendancePanel';
import QRCodeTicket from './QRCodeTicket';
import FeedbackForm from './FeedbackForm';
import StudentProfile from './StudentProfile';
import StudentNoticeBoard from './StudentNoticeBoard';
import { FaHome, FaUtensils, FaBullhorn, FaUser } from 'react-icons/fa';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const NavButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
        activeTab === id 
          ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
          : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-blue-600'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto pb-10 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Student Portal</h1>
          
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-xl">
            <NavButton id="dashboard" label="Overview" icon={<FaHome />} />
            <NavButton id="meals" label="Meals" icon={<FaUtensils />} />
            <NavButton id="notices" label="Notices" icon={<FaBullhorn />} />
            <NavButton id="profile" label="Profile" icon={<FaUser />} />
          </div>
        </div>

        {/* --- TAB 1: DASHBOARD OVERVIEW --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Row: Attendance & Welcome */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <AttendancePanel />
              </div>
              <div className="md:col-span-1">
                 <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-6 rounded shadow-lg h-full flex flex-col justify-center items-center text-center">
                    <h3 className="font-bold text-2xl mb-2">Welcome Back!</h3>
                    <p className="text-blue-100 text-sm opacity-90">Hostel Entry closes at 9:00 PM.</p>
                 </div>
              </div>
              <div className="md:col-span-1">
                <QRCodeTicket />
              </div>
            </div>

            {/* Recent Notices Preview (Mini) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white p-6 rounded shadow border-l-4 border-yellow-500">
                  <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                     <FaBullhorn className="text-yellow-500" /> Latest Notice
                  </h3>
                  <p className="text-sm text-gray-500">Check the Notices tab for full details.</p>
                  <button onClick={() => setActiveTab('notices')} className="text-blue-600 text-sm font-bold mt-2 hover:underline">View All</button>
               </div>
               
               {/* Quick Feedback */}
               <FeedbackForm />
            </div>
          </div>
        )}

        {/* --- TAB 2: MEALS --- */}
        {activeTab === 'meals' && (
          <div className="animate-fade-in">
             <MealView />
          </div>
        )}

        {/* --- TAB 3: NOTICES --- */}
        {activeTab === 'notices' && (
          <div className="animate-fade-in">
             <StudentNoticeBoard />
          </div>
        )}

        {/* --- TAB 4: PROFILE --- */}
        {activeTab === 'profile' && (
          <div className="animate-fade-in">
             <StudentProfile />
          </div>
        )}

      </div>
    </Layout>
  );
};

export default StudentDashboard;