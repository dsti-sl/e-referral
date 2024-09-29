'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Function to display the map and markers
const LocationMap = ({ data }: { data: any[] }) => {
  const [map, setMap] = useState<any>(null);
  const centerPosition = [8.4897, -11.812]; // Center position for Sierra Leone

  useEffect(() => {
    // Fix leaflet's default marker icon issue
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  // Extract and map through the locations from the data array
  const markers = data
    .filter((item) => item?.parameters?.location) // Ensure location exists
    .map((item, index) => {
      const locationString = item?.parameters?.location;
      const locationArray = locationString?.split(',');

      // Ensure the locationString is correctly formatted as lat,lng
      if (locationArray && locationArray.length === 2) {
        const [lat, lng] = locationArray.map(Number);

        // Only proceed if valid latitude and longitude values
        if (!isNaN(lat) && !isNaN(lng)) {
          // Calculate total request count for this location
          const totalRequests = data
            .filter((loc) => loc?.location === locationString)
            .reduce((acc, loc) => acc + loc.request_count, 0);

          return (
            <Marker key={index} position={[lat, lng]}>
              <Popup>
                <div>
                  <strong>
                    {' '}
                    {item.parameters.location_name || 'Unknown Location'}
                  </strong>
                  <br />
                  <br />
                  Total Requests: {totalRequests}
                </div>
              </Popup>
            </Marker>
          );
        }
      }

      return null; // Skip invalid locations
    })
    .filter((marker) => marker !== null); // Filter out any invalid markers

  const handleZoomEnd = () => {
    if (map) {
      const zoomLevel = map.getZoom();
      // Reset position if zoom level exceeds 12
      if (zoomLevel > 12) {
        map.setView(centerPosition, 7); // Reset to center position with zoom level 7
      }
    }
  };

  return (
    <div className="my-4 border-separate bg-white p-6 shadow-lg">
      <h4 className="mb-2 py-4 text-center text-2xl">Session by Location</h4>
      <MapContainer
        center={centerPosition}
        zoom={8}
        scrollWheelZoom={false}
        style={{ height: '700px', width: '100%' }}
        whenCreated={setMap} // Store the map instance
        onZoomEnd={handleZoomEnd} // Add zoom end event handler
      >
        {/* TileLayer for the map styling */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markers}
      </MapContainer>
    </div>
  );
};

export default LocationMap;
