import Meal from '../models/Meal.js';
import Booking from '../models/Booking.js';
import WeeklyMenu from '../models/WeeklyMenu.js';
import Notification from '../models/Notification.js';

// @desc    Add a meal to the menu (Staff only)
// @route   POST /api/meals
export const addMeal = async (req, res) => {
  const { date, type, items, price } = req.body;

  try {
    const meal = await Meal.create({
      date,
      type,
      items,
      price,
      createdBy: req.user._id
    });
    res.status(201).json(meal);
  } catch (error) {
    res.status(400).json({ message: 'Meal already exists for this slot or invalid data' });
  }
};

// @desc    Get meals for a specific date (or all upcoming)
// @route   GET /api/meals
export const getMeals = async (req, res) => {
  try {
    // If date is provided in query (?date=2023-10-25), filter by it. Otherwise get all.
    const filter = req.query.date ? { date: req.query.date } : {};
    const meals = await Meal.find(filter).sort({ date: 1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get the weekly template
// @route   GET /api/meals/template
export const getTemplate = async (req, res) => {
  try {
    const template = await WeeklyMenu.find({}).sort({ day: 1 });
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save/Update a template slot
// @route   POST /api/meals/template
export const updateTemplate = async (req, res) => {
  const { day, type, items } = req.body;
  try {
    // Upsert: Update if exists, Insert if not
    const template = await WeeklyMenu.findOneAndUpdate(
      { day, type },
      { items },
      { new: true, upsert: true }
    );
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply template to a specific week
// @route   POST /api/meals/template/apply
export const applyTemplate = async (req, res) => {
  const { startDate } = req.body; // e.g., "2025-12-22" (Must be a Monday ideally)
  
  try {
    const templates = await WeeklyMenu.find({});
    if (templates.length === 0) return res.status(400).json({ message: "No template defined yet." });

    const start = new Date(startDate);
    const logs = [];

    // Helper to add days to a date
    const addDays = (date, days) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result.toISOString().split('T')[0];
    };

    // Map day names to index (0 = Sunday, 1 = Monday...)
    // But our input start date is the reference.
    // Let's assume startDate is the anchor and we calculate dates relative to it.
    // Ideally, UI passes startDate as the date for 'Monday'.
    
    const dayMap = { 'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3, 'Friday': 4, 'Saturday': 5, 'Sunday': 6 };

    for (const temp of templates) {
      const dayIndex = dayMap[temp.day];
      if (dayIndex !== undefined) {
        const targetDate = addDays(start, dayIndex);
        
        // Check if meal already exists
        const exists = await Meal.findOne({ date: targetDate, type: temp.type });
        
        if (!exists) {
          await Meal.create({
            date: targetDate,
            type: temp.type,
            items: temp.items,
            price: temp.price,
            createdBy: req.user._id
          });
          logs.push(`Created ${temp.day} ${temp.type} (${targetDate})`);
        } else {
          logs.push(`Skipped ${temp.day} ${temp.type} (${targetDate}) - Already exists`);
        }
      }
    }

    // Create a notification for staff
    await Notification.create({
        recipientRole: 'staff',
        title: 'Weekly Menu Applied',
        message: `Menu for week starting ${startDate} has been generated.`,
        type: 'info'
    });

    res.json({ message: 'Template applied successfully', logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};