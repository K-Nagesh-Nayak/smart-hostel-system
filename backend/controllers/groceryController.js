import GroceryItem from '../models/GroceryItem.js';
import Booking from '../models/Booking.js'; // Required for cooking logic

// @desc    Get all inventory
// @route   GET /api/grocery
export const getInventory = async (req, res) => {
  try {
    const items = await GroceryItem.find({}).sort({ name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new item
// @route   POST /api/grocery
export const addItem = async (req, res) => {
  const { name, category, quantity, unit, minLevel } = req.body;
  try {
    const newItem = await GroceryItem.create({
      name, category, quantity, unit, minLevel
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update stock manually
// @route   PATCH /api/grocery/:id
export const updateStock = async (req, res) => {
  const { amount, action } = req.body; 
  
  try {
    const item = await GroceryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    let change = Number(amount);
    if (action === 'consumed') {
      change = -change; 
    }

    item.quantity += change;
    item.usageHistory.push({ changeAmount: change, action: action });
    item.lastUpdated = Date.now();

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Deduct ingredients based on bookings
// @route   POST /api/grocery/cook
export const cookMealDeduction = async (req, res) => {
  const { mealId, mealItems } = req.body;

  try {
    // 1. Count Bookings
    const count = await Booking.countDocuments({ mealId, status: 'booked' });
    
    // Allow cooking even if 0 bookings (for staff food), but warn in logs
    if (count === 0) {
        // Option: return error, or proceed with 0 deduction? 
        // Let's return error to prevent accidental clicks
        return res.status(400).json({ message: 'No bookings found. Cannot cook empty meal.' });
    }

    const logs = [];

    // 2. Iterate ingredients and deduct
    for (const foodItem of mealItems) {
      let deduction = 0;
      let groceryName = '';

      // Simple keyword matching logic
      if (foodItem.toLowerCase().includes('rice')) {
        deduction = count * 0.1; // 100g per person
        groceryName = 'Rice';
      } else if (foodItem.toLowerCase().includes('dal')) {
        deduction = count * 0.05; // 50g per person
        groceryName = 'Dal';
      } else if (foodItem.toLowerCase().includes('chicken')) {
        deduction = count * 0.2; // 200g per person
        groceryName = 'Chicken';
      } else if (foodItem.toLowerCase().includes('egg')) {
        deduction = count * 1; // 1 unit per person
        groceryName = 'Egg';
      }
      
      if (deduction > 0) {
        // Find item in inventory (case insensitive)
        const item = await GroceryItem.findOne({ name: { $regex: new RegExp(groceryName, "i") } });
        
        if (item) {
          // Prevent negative stock
          const newQty = Math.max(0, item.quantity - deduction);
          const actualDeduction = item.quantity - newQty;

          item.quantity = newQty;
          item.usageHistory.push({ changeAmount: -actualDeduction, action: 'cooked_meal' });
          await item.save();
          logs.push(`Deducted ${actualDeduction.toFixed(2)} ${item.unit} of ${item.name}`);
        } else {
            logs.push(`⚠️ Ingredient '${groceryName}' not found in Inventory.`);
        }
      }
    }

    if (logs.length === 0) {
        logs.push("No matching ingredients found (Rice, Dal, Chicken, Egg) in menu items.");
    }

    res.json({ message: 'Inventory Updated', logs, studentCount: count });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};