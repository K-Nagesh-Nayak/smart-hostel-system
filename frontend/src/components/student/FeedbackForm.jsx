import { useState } from 'react';
import axios from 'axios';
import { FaStar, FaPaperPlane, FaCommentDots } from 'react-icons/fa';

const FeedbackForm = () => {
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('food');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/feedback', {
        category, rating, comment
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setComment('');
        setRating(5);
      }, 3000);
    } catch (error) {
      alert("Error submitting feedback");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md border-t-4 border-yellow-500">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <FaCommentDots className="text-yellow-500"/> Submit Feedback
      </h2>
      
      {submitted ? (
        <div className="bg-green-100 text-green-700 p-6 rounded text-center font-bold animate-fade-in">
            ✅ Thank you! Your feedback has been sent.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                <select 
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-yellow-400 outline-none" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="food">Food Quality</option>
                    <option value="hygiene">Hygiene & Cleanliness</option>
                    <option value="staff">Staff Behavior</option>
                    <option value="facility">Facilities (Wifi/Water)</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rating</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-2xl transition transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                            <FaStar />
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Comments</label>
                <textarea 
                    className="w-full border p-2 rounded h-24 focus:ring-2 focus:ring-yellow-400 outline-none" 
                    placeholder="Tell us what you think..."
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                ></textarea>
            </div>

            <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 transition shadow-md">
                <FaPaperPlane /> Send Feedback
            </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackForm;