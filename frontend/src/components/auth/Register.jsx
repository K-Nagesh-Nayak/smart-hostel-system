import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    room: '',
    phone: '',
    guardianName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }
    
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("✅ Registration Successful! Please wait for Admin approval.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">Join Smart Hostel</h2>
        <p className="text-center text-gray-500 mb-8">Create your student account</p>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-bold border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" type="text" placeholder="Full Name" required onChange={handleChange} className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
          
          <div className="grid grid-cols-2 gap-4">
             <input name="email" type="email" placeholder="Email Address" required onChange={handleChange} className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
             <input name="phone" type="text" placeholder="Phone Number" required onChange={handleChange} className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <input name="room" type="text" placeholder="Room No (e.g. 101)" required onChange={handleChange} className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
             <input name="guardianName" type="text" placeholder="Guardian Name" required onChange={handleChange} className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
             <input name="confirmPassword" type="password" placeholder="Confirm Password" required onChange={handleChange} className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg mt-4">
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;