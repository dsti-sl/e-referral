'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const LocationMap = ({ data }: { data: any[] }) => {
  const [map, setMap] = useState<any>(null);
  const centerPosition = [8.4897, -11.812]; // Sierra Leone center

  useEffect(() => {
    if (typeof window !== 'undefined') {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        iconUrl:
          'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    }
  }, []);

  // Extract and map through the locations from the data array
  const markers = data
    .filter((item) => item?.parameters?.location)
    .map((item, index) => {
      const locationString = item?.parameters?.location;
      const locationArray = locationString?.split(',');

      if (locationArray && locationArray.length === 2) {
        const [lat, lng] = locationArray.map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          const totalRequests = data
            .filter((loc) => loc?.parameters?.location === locationString)
            .reduce((acc, loc) => acc + loc.request_count, 0);

          return (
            <Marker key={index} position={[lat, lng]}>
              <Popup>
                <div>
                  <strong>
                    {item.parameters.location_name || 'Unknown Location'}
                  </strong>
                  <br />
                  Total Requests: {totalRequests}
                </div>
              </Popup>
            </Marker>
          );
        }
      }
      return null;
    })
    .filter((marker) => marker !== null);

  const handleZoomEnd = () => {
    if (map) {
      const zoomLevel = map.getZoom();
      if (zoomLevel > 12) {
        map.setView(centerPosition, 7);
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
        whenCreated={setMap}
        onZoomEnd={handleZoomEnd}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markers}
      </MapContainer>
    </div>
  );
};

export default LocationMap;
