import { useState, useEffect } from 'react';
import axios from 'axios';

const MealView = () => {
  const [meals, setMeals] = useState([]);
  const [bookings, setBookings] = useState({}); // Store booking status by mealId

  // Load Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get all upcoming meals
        const mealsRes = await axios.get('http://localhost:5000/api/meals');
        setMeals(mealsRes.data);

        // 2. Get my existing bookings
        const bookingRes = await axios.get('http://localhost:5000/api/bookings/my');
        
        // Convert array to object for easier lookup: { mealId: 'booked' }
        const bookingMap = {};
        bookingRes.data.forEach(b => {
          bookingMap[b.mealId] = b.status;
        });
        setBookings(bookingMap);

      } catch (error) {
        console.error("Error loading data", error);
      }
    };
    fetchData();
  }, []);

  // Handle Booking
  const handleBooking = async (mealId, status) => {
    try {
      await axios.post('http://localhost:5000/api/bookings', { mealId, status });
      
      // Update local state instantly (UI Optimistic update)
      setBookings(prev => ({ ...prev, [mealId]: status }));
      
    } catch (error) {
      alert("Booking failed: " + (error.response?.data?.message || "Server Error"));
    }
  };

  // --- SMART FEATURE: Booking Cut-off Logic ---
  const isBookingAllowed = (mealDate, mealType) => {
    const now = new Date();
    const deadline = new Date(mealDate); // Create date object from meal date string

    // Set deadline times based on meal type
    // Note: This assumes the mealDate string is properly parsed by the browser
    if (mealType === 'breakfast') deadline.setHours(7, 0, 0, 0);   // Deadline: 7:00 AM same day
    else if (mealType === 'lunch') deadline.setHours(10, 0, 0, 0); // Deadline: 10:00 AM same day
    else if (mealType === 'dinner') deadline.setHours(17, 0, 0, 0); // Deadline: 5:00 PM same day
    
    // If "Now" is past the "Deadline", return false (Booking Closed)
    // We also check if the date itself is in the past (e.g., yesterday's meals)
    if (now > deadline) return false;
    
    return true;
  };

  return (
    <div className="max-w-6xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6 text-purple-700">Daily Menu & Booking</h2>
      
      {meals.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No meals posted for this week yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal) => {
            const myStatus = bookings[meal._id]; // 'booked', 'skipped', or undefined
            const isOpen = isBookingAllowed(meal.date, meal.type);

            return (
              <div key={meal._id} className={`bg-white rounded-lg shadow-md overflow-hidden border-t-4 transition-all hover:shadow-lg ${
                myStatus === 'booked' ? 'border-green-500' : 
                myStatus === 'skipped' ? 'border-red-500' : 'border-gray-300'
              }`}>
                
                {/* Card Header */}
                <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                  <span className="font-bold text-gray-700 uppercase tracking-wide">{meal.type}</span>
                  <span className="text-sm font-medium text-gray-500 bg-white px-2 py-1 rounded border">
                    {meal.date}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <p className="text-gray-800 mb-6 h-12 overflow-hidden text-lg font-light">
                    {meal.items.join(', ')}
                  </p>

                  {/* Buttons Section - CONDITIONAL RENDERING */}
                  <div className="flex gap-2">
                    {isOpen ? (
                      <>
                        <button
                          onClick={() => handleBooking(meal._id, 'booked')}
                          className={`flex-1 py-2 rounded font-semibold transition ${
                            myStatus === 'booked' 
                              ? 'bg-green-600 text-white shadow-inner' 
                              : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                          }`}
                        >
                          {myStatus === 'booked' ? '✔ Booked' : 'Book Meal'}
                        </button>

                        <button
                          onClick={() => handleBooking(meal._id, 'skipped')}
                          className={`flex-1 py-2 rounded font-semibold transition ${
                            myStatus === 'skipped' 
                              ? 'bg-red-600 text-white shadow-inner' 
                              : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                          }`}
                        >
                          {myStatus === 'skipped' ? '✖ Skipped' : 'Skip'}
                        </button>
                      </>
                    ) : (
                      // If Booking is Closed:
                      <div className="w-full text-center bg-gray-100 text-gray-400 py-2 rounded border border-gray-200 font-medium italic">
                        Booking Closed
                      </div>
                    )}
                  </div>
                  
                  {/* Status Indicator Text */}
                  {!isOpen && myStatus && (
                    <p className="text-center text-xs mt-2 text-gray-400">
                      You {myStatus} this meal.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MealView;