import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHistory, FaBoxOpen } from 'react-icons/fa';

const GroceryManagement = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', category: 'other', quantity: 0, unit: 'kg', minLevel: 5 });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // Toggle History View

  // Load Inventory
  const fetchInventory = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/grocery');
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  // Actions
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/grocery', newItem);
      alert('Item Added');
      fetchInventory();
      setShowAddForm(false);
    } catch (error) {
      alert('Error adding item');
    }
  };

  const handleUpdate = async (id, amount, action) => {
    const qty = prompt(`Enter quantity to ${action} (in units):`);
    if (!qty) return;

    try {
      await axios.patch(`http://localhost:5000/api/grocery/${id}`, {
        amount: Number(qty),
        action
      });
      fetchInventory();
    } catch (error) {
      alert('Update failed');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-5xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
           <FaBoxOpen /> Pantry Inventory
        </h2>
        <div className="flex gap-2">
           <button 
            onClick={() => setShowHistory(!showHistory)}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 flex items-center gap-2"
          >
            <FaHistory /> {showHistory ? 'Hide History' : 'Audit Logs'}
          </button>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {showAddForm ? 'Cancel' : '+ Add Item'}
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="bg-green-50 p-4 rounded mb-6 border border-green-200 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <input type="text" placeholder="Item Name" required className="border p-2 rounded"
              onChange={e => setNewItem({...newItem, name: e.target.value})} />
            <select className="border p-2 rounded" onChange={e => setNewItem({...newItem, category: e.target.value})}>
              <option value="grain">Grain/Rice</option>
              <option value="vegetable">Vegetable</option>
              <option value="dairy">Dairy</option>
              <option value="spice">Spice</option>
              <option value="other">Other</option>
            </select>
            <input type="number" placeholder="Qty" required className="border p-2 rounded"
              onChange={e => setNewItem({...newItem, quantity: e.target.value})} />
            <input type="text" placeholder="Unit (kg/L)" required className="border p-2 rounded"
              onChange={e => setNewItem({...newItem, unit: e.target.value})} />
            <button type="submit" className="bg-green-600 text-white rounded font-bold">Save</button>
          </div>
        </form>
      )}

      {/* VIEW 1: INVENTORY TABLE */}
      {!showHistory && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Stock Level</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isLow = item.quantity <= item.minLevel;
                return (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3 capitalize">{item.category}</td>
                    <td className="px-4 py-3 font-bold text-lg">
                      {item.quantity} <span className="text-xs font-normal text-gray-500">{item.unit}</span>
                    </td>
                    <td className="px-4 py-3">
                      {isLow ? (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold animate-pulse">
                          ⚠ Low
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">OK</span>
                      )}
                    </td>
                    <td className="px-4 py-3 flex gap-2 justify-center">
                      <button 
                        onClick={() => handleUpdate(item._id, 0, 'consumed')}
                        className="text-red-600 hover:text-red-800 border px-2 py-1 rounded text-xs"
                      >
                        - Use
                      </button>
                      <button 
                        onClick={() => handleUpdate(item._id, 0, 'restocked')}
                        className="text-blue-600 hover:text-blue-800 border px-2 py-1 rounded text-xs"
                      >
                        + Add
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 2: HISTORY LOGS */}
      {showHistory && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-600 border-b pb-2">Recent Audit Logs</h3>
          {items.flatMap(item => 
            item.usageHistory.map(log => ({ ...log, itemName: item.name, itemUnit: item.unit }))
          )
          .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by newest
          .slice(0, 50) // Show last 50 logs
          .map((log, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded border-l-4 border-gray-400">
              <div>
                <p className="font-bold text-gray-800">
                   {log.itemName} 
                   <span className={log.changeAmount > 0 ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
                     {log.changeAmount > 0 ? '+' : ''}{log.changeAmount} {log.itemUnit}
                   </span>
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  Action: {log.action.replace('_', ' ')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{new Date(log.date).toLocaleString()}</p>
              </div>
            </div>
          ))}
          {items.length === 0 && <p>No history available.</p>}
        </div>
      )}
    </div>
  );
};

export default GroceryManagement;