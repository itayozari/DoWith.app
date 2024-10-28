import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Event } from '../types';
import EventCard from './EventCard';

const customIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="32" height="42" class="marker-svg">
    <path d="M215.7 499.2C267 435.9 384 279.4 384 192C384 86.02 297.9 0 192 0S0 86.02 0 192c0 87.4 117 243.9 168.3 307.2c9.18 11.36 29.73 11.36 38.91 0zM192 256c-35.35 0-64-28.65-64-64s28.65-64 64-64s64 28.65 64 64s-28.65 64-64 64z" 
      fill="rgba(239, 68, 68, 0.8)" 
      stroke="white" 
      stroke-width="24"
    />
  </svg>`,
  className: 'custom-marker-icon',
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -42]
});

interface MapViewProps {
  events: Event[];
  onBookEvent?: (eventId: string) => void;
  userBookings?: Set<string>;
}

export default function MapView({ events, onBookEvent, userBookings = new Set() }: MapViewProps) {
  const telAvivCenter: [number, number] = [32.0853, 34.7818];
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const popupTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    return () => {
      Object.values(popupTimeoutRef.current).forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const handleMarkerCreated = (marker: L.Marker, eventId: string) => {
    markersRef.current[eventId] = marker;

    marker.on('mouseover', () => {
      if (popupTimeoutRef.current[eventId]) {
        clearTimeout(popupTimeoutRef.current[eventId]);
      }
      marker.openPopup();
    });

    marker.on('mouseout', () => {
      popupTimeoutRef.current[eventId] = setTimeout(() => {
        if (!marker.getPopup()?.getElement()?.matches(':hover')) {
          marker.closePopup();
        }
      }, 100);
    });

    const popup = marker.getPopup();
    if (popup) {
      popup.getElement()?.addEventListener('mouseenter', () => {
        if (popupTimeoutRef.current[eventId]) {
          clearTimeout(popupTimeoutRef.current[eventId]);
        }
      });

      popup.getElement()?.addEventListener('mouseleave', () => {
        marker.closePopup();
      });
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] relative">
      <MapContainer
        center={telAvivCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        className="z-0"
        ref={mapRef}
        scrollWheelZoom={true}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map((event) => (
          <Marker
            key={event.id}
            position={[event.location.lat, event.location.lng]}
            icon={customIcon}
            ref={(ref) => ref && handleMarkerCreated(ref, event.id)}
          >
            <Popup closeButton={false} autoPan={false} className="custom-popup">
              <div className="w-auto">
                <EventCard 
                  event={event} 
                  isMapView={true} 
                  onBook={onBookEvent || (() => {})}
                  isBooked={userBookings.has(event.id)}
                />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}