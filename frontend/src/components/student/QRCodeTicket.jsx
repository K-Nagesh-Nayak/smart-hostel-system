import QRCode from 'react-qr-code';
import { useAuth } from '../../contexts/AuthContext';

const QRCodeTicket = () => {
  const { user } = useAuth();
  const date = new Date().toISOString().split('T')[0];
  
  // SIMPLIFIED DATA: Easier for cameras to scan rapidly
  // Format: "ID | NAME | DATE"
  const ticketData = `${user._id}|${user.name}|${date}`;

  return (
    <div className="bg-white p-6 rounded shadow-md border-t-4 border-purple-500 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Digital Meal Pass</h2>
      
      {/* ADDED PADDING: QR codes need 'quiet zone' (white space) to work */}
      <div className="bg-white p-4 border-2 border-gray-200 rounded">
        <QRCode 
          value={ticketData} 
          size={180} 
          level="L" // L = Low error correction (Less dense dots, easier to scan)
        />
      </div>
      
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Show to Mess Staff</p>
        <p className="font-bold text-gray-800 text-lg">{user.name}</p>
        <p className="text-sm text-gray-600">{date}</p>
      </div>
    </div>
  );
};

export default QRCodeTicket;