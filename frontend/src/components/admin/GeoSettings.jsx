import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMapEvents } from 'react-leaflet';
import axios from 'axios';
// IMPORTANT: You must import Leaflet CSS in main.jsx, or the map will look broken.

// Component to handle map clicks
const LocationMarker = ({ setPos }) => {
  useMapEvents({
    click(e) {
      setPos(e.latlng);
    },
  });
  return null;
};

const GeoSettings = () => {
  const [position, setPosition] = useState({ lat: 12.9716, lng: 77.5946 });
  const [radius, setRadius] = useState(500);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/admin/settings/geo');
        if (data.lat) setPosition({ lat: data.lat, lng: data.lng });
        if (data.radius) setRadius(data.radius);
      } catch (error) {
        console.error("Failed to load geo settings", error);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/admin/settings/geo', {
        lat: position.lat,
        lng: position.lng,
        radius
      });
      alert("✅ Geofence Updated Successfully!");
    } catch (error) {
      alert("Error updating settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow border-t-4 border-green-600 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📍 Hostel Geolocation Setup</h2>
        <button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 shadow"
        >
            {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
      
      <div className="flex gap-4 mb-4 text-sm bg-gray-50 p-3 rounded">
        <div>
            <label className="block text-gray-500 font-bold">Latitude</label>
            <input value={position.lat.toFixed(5)} disabled className="border p-1 rounded bg-white w-24" />
        </div>
        <div>
            <label className="block text-gray-500 font-bold">Longitude</label>
            <input value={position.lng.toFixed(5)} disabled className="border p-1 rounded bg-white w-24" />
        </div>
        <div>
            <label className="block text-gray-500 font-bold">Radius (meters)</label>
            <input 
                type="number" 
                value={radius} 
                onChange={(e) => setRadius(Number(e.target.value))}
                className="border p-1 rounded w-24 focus:ring-2 focus:ring-green-500" 
            />
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-2">Click anywhere on the map to pin the Hostel's center.</p>

      {/* Map Container */}
      <div className="flex-1 min-h-[400px] border-2 border-gray-300 rounded overflow-hidden relative z-0">
        <MapContainer center={[position.lat, position.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            <LocationMarker setPos={setPosition} />
            <Marker position={[position.lat, position.lng]} />
            <Circle center={[position.lat, position.lng]} radius={radius} pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.2 }} />
        </MapContainer>
      </div>
    </div>
  );
};

export default GeoSettings;