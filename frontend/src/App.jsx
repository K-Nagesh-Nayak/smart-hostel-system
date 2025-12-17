import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Layout from './components/common/Layout';
// --- IMPORT THE REAL DASHBOARD HERE ---
import AdminDashboard from './components/admin/Dashboard'; 
import StaffDashboard from './components/staff/Dashboard';
import StudentDashboard from './components/student/Dashboard';
import GroceryManagement from './components/staff/GroceryManagement';
import Register from './components/auth/Register';
import './index.css';

// Keep these placeholders for now until Phase 2 & 3



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected Routes */}
          <Route path="/admin" element={<AdminDashboard />} /> {/* Now uses the imported file */}
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
        

          <Route path="/staff/inventory" element={
  <Layout>
    <GroceryManagement />
  </Layout>
} />

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;