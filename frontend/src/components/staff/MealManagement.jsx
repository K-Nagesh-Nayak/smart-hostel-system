import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFire, FaUtensils, FaCalendarAlt, FaMagic, FaSave } from 'react-icons/fa';

const MealManagement = () => {
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' or 'weekly'
  const [meals, setMeals] = useState([]);
  const [stats, setStats] = useState({});
  const [newItem, setNewItem] = useState({ date: '', type: 'breakfast', items: '', price: 50 });

  // Weekly Template State
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner'];
  const [template, setTemplate] = useState({}); // Format: { "Monday-breakfast": "Items" }
  const [applyDate, setApplyDate] = useState(''); // Date to start generating meals

  // --- 1. LOAD DATA ---
  const fetchData = async () => {
    try {
      // Get Meals
      const mealsRes = await axios.get('http://localhost:5000/api/meals');
      setMeals(mealsRes.data);

      // Get Stats
      if (mealsRes.data.length > 0) {
        const uniqueDates = [...new Set(mealsRes.data.map(m => m.date))];
        let allStats = {};
        for (const date of uniqueDates) {
             const statRes = await axios.get(`http://localhost:5000/api/bookings/stats?date=${date}`);
             allStats = { ...allStats, ...statRes.data };
        }
        setStats(allStats);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTemplate = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/meals/template');
      // Convert array to quick-lookup object
      const tempMap = {};
      data.forEach(t => {
        tempMap[`${t.day}-${t.type}`] = t.items.join(', ');
      });
      setTemplate(tempMap);
    } catch (error) {
      console.error("Error loading template", error);
    }
  };

  useEffect(() => { 
    fetchData(); 
    fetchTemplate();
  }, []);

  // --- 2. ACTIONS ---

  // Add Single Meal
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const itemsArray = newItem.items.split(',').map(i => i.trim());
      await axios.post('http://localhost:5000/api/meals', { ...newItem, items: itemsArray });
      alert('Meal Added!');
      fetchData();
      setNewItem({ ...newItem, items: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding meal');
    }
  };

  // Cook & Deduct
  const handleCook = async (meal) => {
    const count = stats[meal._id] || 0;
    if (count === 0) return alert("No bookings for this meal yet.");

    if (window.confirm(`Cook for ${count} students? This deducts inventory.`)) {
      try {
        const res = await axios.post('http://localhost:5000/api/grocery/cook', {
          mealId: meal._id,
          mealItems: meal.items
        });
        alert("✅ Cooking Started!\n\n" + (res.data.logs.join('\n') || "No matching ingredients found."));
      } catch (error) {
        alert("Error: " + (error.response?.data?.message || error.message));
      }
    }
  };

  // Save Template Slot
  const handleSaveTemplate = async (day, type) => {
    const itemsStr = template[`${day}-${type}`] || '';
    if (!itemsStr) return;

    try {
      await axios.post('http://localhost:5000/api/meals/template', {
        day,
        type,
        items: itemsStr.split(',').map(i => i.trim())
      });
      alert(`Saved ${day} ${type}`);
    } catch (error) {
      alert("Failed to save template");
    }
  };

  // Apply Template (Generate Week)
  const handleApplyTemplate = async () => {
    if (!applyDate) return alert("Please select a start date (Monday)");
    
    try {
      const res = await axios.post('http://localhost:5000/api/meals/template/apply', {
        startDate: applyDate
      });
      alert("✅ " + res.data.message + "\n\n" + res.data.logs.join('\n'));
      fetchData(); // Refresh daily list
      setActiveTab('daily'); // Switch back to view result
    } catch (error) {
      alert("Error: " + error.response?.data?.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-6xl mx-auto mt-6">
      
      {/* Header & Tabs */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <FaUtensils /> Kitchen Management
        </h2>
        <div className="flex gap-2 bg-gray-100 p-1 rounded">
          <button 
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-2 rounded font-medium transition ${activeTab === 'daily' ? 'bg-white shadow text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Daily Operations
          </button>
          <button 
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-2 rounded font-medium transition ${activeTab === 'weekly' ? 'bg-white shadow text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Weekly Planner
          </button>
        </div>
      </div>

      {/* --- TAB 1: DAILY OPERATIONS --- */}
      {activeTab === 'daily' && (
        <>
          <form onSubmit={handleSubmit} className="bg-blue-50 p-4 rounded-lg mb-8 border border-blue-100 shadow-sm">
            <h3 className="font-semibold mb-3 text-blue-800">Add Single Meal</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input 
                type="date" required className="border p-2 rounded"
                onChange={e => setNewItem({...newItem, date: e.target.value})}
                value={newItem.date}
              />
              <select className="border p-2 rounded" onChange={e => setNewItem({...newItem, type: e.target.value})}>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
              <input 
                type="text" placeholder="Items (e.g. Rice, Dal)" required className="border p-2 rounded md:col-span-1"
                value={newItem.items} onChange={e => setNewItem({...newItem, items: e.target.value})}
              />
              <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Add</button>
            </div>
          </form>

          <div className="grid gap-4">
            {meals.length === 0 ? <p className="text-gray-500 italic">No meals scheduled.</p> : meals.map((meal) => {
              const count = stats[meal._id] || 0;
              return (
                <div key={meal._id} className="border p-4 rounded-lg flex justify-between items-center bg-white shadow-sm border-l-4 border-l-blue-500 hover:shadow-md">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-800 uppercase">{meal.type}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{meal.date}</span>
                    </div>
                    <p className="text-gray-600">{meal.items.join(', ')}</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="text-center bg-gray-50 p-2 rounded border border-gray-200 min-w-[80px]">
                      <span className="block text-xl font-bold text-gray-800">{count}</span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase">Orders</span>
                    </div>
                    <button 
                      onClick={() => handleCook(meal)}
                      disabled={count === 0}
                      className={`flex items-center gap-2 px-3 py-2 rounded font-bold text-white text-sm shadow ${count > 0 ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'}`}
                    >
                      <FaFire /> Cook
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* --- TAB 2: WEEKLY PLANNER --- */}
      {activeTab === 'weekly' && (
        <div className="animate-fade-in">
          {/* Generator Section */}
          <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-purple-800 flex items-center gap-2">
                <FaMagic /> Auto-Generate Menu
              </h3>
              <p className="text-sm text-purple-600">Apply the template below to a specific week.</p>
            </div>
            <div className="flex gap-2 items-end">
              <div>
                <label className="text-xs font-bold text-purple-700 block mb-1">Start Date (Monday)</label>
                <input 
                  type="date" 
                  className="border border-purple-300 p-2 rounded text-sm"
                  onChange={(e) => setApplyDate(e.target.value)}
                />
              </div>
              <button 
                onClick={handleApplyTemplate}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 shadow font-bold"
              >
                Generate Meals
              </button>
            </div>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 gap-6">
            {daysOfWeek.map(day => (
              <div key={day} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-100 px-4 py-2 font-bold text-gray-700 border-b flex justify-between">
                  <span>{day}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                  {mealTypes.map(type => (
                    <div key={type} className="p-3 bg-white">
                      <label className="text-xs font-bold text-gray-400 uppercase block mb-1">{type}</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          className="w-full border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-purple-500 outline-none"
                          placeholder={`Items for ${type}`}
                          value={template[`${day}-${type}`] || ''}
                          onChange={(e) => setTemplate({...template, [`${day}-${type}`]: e.target.value})}
                        />
                        <button 
                          onClick={() => handleSaveTemplate(day, type)}
                          className="text-purple-600 hover:text-purple-800 p-1"
                          title="Save Slot"
                        >
                          <FaSave />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealManagement;