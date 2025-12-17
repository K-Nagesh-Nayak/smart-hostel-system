import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { FaQrcode, FaTimes } from 'react-icons/fa';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (isScanning) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 5, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(onScanSuccess, onScanFailure);

      function onScanSuccess(decodedText) {
        // Parse the ticket data "ID|Name|Date"
        const parts = decodedText.split('|');
        if(parts.length >= 3) {
            setScanResult({
                id: parts[0],
                name: parts[1],
                date: parts[2],
                valid: parts[2] === new Date().toISOString().split('T')[0]
            });
            scanner.clear();
            setIsScanning(false);
        } else {
            alert("Invalid QR Code Format");
        }
      }

      function onScanFailure(error) {
        // Handle scan failure (optional)
      }

      return () => {
        scanner.clear().catch(error => console.error("Failed to clear scanner", error));
      };
    }
  }, [isScanning]);

  return (
    <div className="bg-white p-6 rounded shadow border-t-4 border-indigo-500 mb-8">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        <FaQrcode /> Meal Ticket Scanner
      </h2>

      {!isScanning && !scanResult && (
        <button 
          onClick={() => setIsScanning(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded font-bold hover:bg-indigo-700 w-full"
        >
          Start Camera Scanner
        </button>
      )}

      {isScanning && (
        <div>
          <div id="reader" className="w-full"></div>
          <button 
            onClick={() => setIsScanning(false)}
            className="mt-4 text-red-600 underline text-sm w-full text-center"
          >
            Cancel Scanning
          </button>
        </div>
      )}

      {scanResult && (
        <div className={`mt-4 p-4 rounded text-center border-2 ${scanResult.valid ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
          <h3 className={`text-2xl font-bold ${scanResult.valid ? 'text-green-700' : 'text-red-700'}`}>
            {scanResult.valid ? '✅ VALID TICKET' : '❌ EXPIRED / INVALID'}
          </h3>
          <p className="text-lg font-bold mt-2">{scanResult.name}</p>
          <p className="text-gray-500">{scanResult.date}</p>
          <button 
            onClick={() => setScanResult(null)}
            className="mt-4 bg-gray-800 text-white px-4 py-2 rounded text-sm"
          >
            Scan Next
          </button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;