'use client';
import L from 'leaflet';
import React, { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPickerProps {
  location: string;
  onSelect: (lat: number, lng: number) => void;
}

function ClickHandler({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onSelect(
        parseFloat(e.latlng.lat.toFixed(6)),
        parseFloat(e.latlng.lng.toFixed(6)),
      );
    },
  });
  return null;
}

const MapPicker: React.FC<MapPickerProps> = ({ location, onSelect }) => {
  const parts = location.split(',').map(Number);
  const lat = !isNaN(parts[0]) ? parts[0] : 8.4897;
  const lng = !isNaN(parts[1]) ? parts[1] : -11.812;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl:
          'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [20, 32],
        iconAnchor: [10, 32],
      });
    }
  }, []);

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={7}
      style={{ height: '100%', width: '100%', cursor: 'crosshair' }}
      scrollWheelZoom={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]} />
      <ClickHandler onSelect={onSelect} />
    </MapContainer>
  );
};

export default MapPicker;
