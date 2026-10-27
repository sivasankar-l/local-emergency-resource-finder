import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Phone, Navigation, ExternalLink, Crosshair } from 'lucide-react';
import { useLocationContext } from '../context/LocationContext';
import { CATEGORY_COLORS } from './EmergencyCategoryCard';

// Custom category icons using L.divIcon to avoid Vite asset bundle path issues with Leaflet default icons
const createCategoryIcon = (category) => {
  const iconColors = {
    'Hospitals': '#dc2626',
    'Ambulance Services': '#d97706',
    'Police Stations': '#2563eb',
    'Fire Stations': '#ea580c',
    'Pharmacies': '#16a34a',
    'Blood Banks': '#e11d48',
    'Emergency Shelters': '#9333ea'
  };

  const color = iconColors[category] || '#0f172a';

  return L.divIcon({
    className: 'custom-emergency-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        border: 2px solid white;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// User's own location marker (blue pulse)
const userLocationIcon = L.divIcon({
  className: 'user-loc-marker',
  html: `
    <div style="position: relative; width: 24px; height: 24px;">
      <div style="
        position: absolute;
        width: 24px;
        height: 24px;
        background: rgba(14, 165, 233, 0.4);
        border-radius: 50%;
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div style="
        position: absolute;
        top: 4px;
        left: 4px;
        width: 16px;
        height: 16px;
        background: #0284c7;
        border: 2.5px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Helper component to auto-recenter map view
const MapAutoPan = ({ center, bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (center) {
      map.setView(center, map.getZoom() || 13);
    }
  }, [center, bounds, map]);

  return null;
};

export const ResourceMap = ({
  resources = [],
  selectedResource = null,
  onSelectResource = () => {},
  height = '500px'
}) => {
  const { coords, radius } = useLocationContext();
  const mapRef = useRef(null);

  const centerLat = selectedResource?.latitude || coords?.latitude || 12.9698;
  const centerLon = selectedResource?.longitude || coords?.longitude || 79.1559;
  const mapCenter = [centerLat, centerLon];

  // Calculate bounding box for all resources + user location
  let mapBounds = null;
  const validPoints = resources
    .filter((r) => r.latitude && r.longitude)
    .map((r) => [r.latitude, r.longitude]);

  if (coords?.latitude && coords?.longitude) {
    validPoints.push([coords.latitude, coords.longitude]);
  }

  if (validPoints.length > 1) {
    mapBounds = L.latLngBounds(validPoints);
  }

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.setView([coords.latitude, coords.longitude], 13);
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ height }}>
      {/* Recenter Button */}
      <button
        type="button"
        onClick={handleRecenter}
        className="absolute top-4 right-4 z-[1000] bg-white/95 hover:bg-white text-slate-800 p-2.5 rounded-xl shadow-md border border-slate-200 flex items-center gap-1.5 text-xs font-semibold transition"
        title="Recenter to my location"
      >
        <Crosshair className="w-4 h-4 text-emergency-600" />
        <span className="hidden sm:inline">My Location</span>
      </button>

      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapAutoPan center={mapCenter} bounds={mapBounds} />

        {/* User GPS location marker & search radius circle */}
        {coords?.latitude && coords?.longitude && (
          <>
            <Marker position={[coords.latitude, coords.longitude]} icon={userLocationIcon}>
              <Popup>
                <div className="text-xs font-sans">
                  <p className="font-bold text-slate-900 mb-0.5">Your Location</p>
                  <p className="text-slate-600">{coords.displayName || 'Current GPS position'}</p>
                </div>
              </Popup>
            </Marker>

            {radius && (
              <Circle
                center={[coords.latitude, coords.longitude]}
                radius={radius * 1000}
                pathOptions={{
                  color: '#0284c7',
                  fillColor: '#0284c7',
                  fillOpacity: 0.05,
                  weight: 1,
                  dashArray: '4, 4'
                }}
              />
            )}
          </>
        )}

        {/* Resource markers */}
        {resources.map((item) => {
          if (!item.latitude || !item.longitude) return null;
          const markerIcon = createCategoryIcon(item.category);
          const isCurrentSelected = selectedResource?._id === item._id;

          const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`;

          return (
            <Marker
              key={item._id}
              position={[item.latitude, item.longitude]}
              icon={markerIcon}
              eventHandlers={{
                click: () => onSelectResource(item)
              }}
            >
              <Popup className="emergency-leaflet-popup">
                <div className="text-xs font-sans p-1 max-w-[240px]">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    {item.category}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{item.name}</h4>
                  <p className="text-slate-600 mb-2 leading-tight">{item.address}, {item.city}</p>

                  {item.distance !== null && item.distance !== undefined && (
                    <p className="text-[11px] font-semibold text-emergency-600 mb-2">
                      📍 {item.distance} km away
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
                    {item.phone && (
                      <a
                        href={`tel:${item.phone}`}
                        className="flex-1 py-1 px-2 rounded-lg bg-emergency-600 text-white font-bold text-[11px] text-center inline-flex items-center justify-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        Call
                      </a>
                    )}
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 px-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-[11px] font-medium inline-flex items-center gap-1"
                    >
                      <Navigation className="w-3 h-3" />
                      Navigate
                    </a>
                    <Link
                      to={`/resources/${item._id}`}
                      className="p-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default ResourceMap;
