
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { BatteryCharging } from 'lucide-react';

// Add your Mapbox token here
// For security in production, use environment variables
const MAPBOX_TOKEN = 'pk.eyJ1IjoicHJhdGhhbTEyMTAyMCIsImEiOiJjbWFiOXZjMWkxeGh3MmxzZ2toN2hpeHlmIn0.MzYnS4J5NsvagaCOAAcziw';

interface MapProps {
  stations: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    available: number;
    total: number;
  }[];
  onStationSelect?: (stationId: number) => void;
  favorites?: number[]; // Added favorites prop to the interface
}

const EVStationMap: React.FC<MapProps> = ({ stations, onStationSelect, favorites = [] }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-97, 38], // Center on US
      zoom: 3,
      attributionControl: false
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }), 'bottom-right');

    map.current.on('load', () => {
      setMapInitialized(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Add markers when map is initialized or stations change
  useEffect(() => {
    if (!map.current || !mapInitialized) return;
    
    // Remove existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    
    // Add new markers
    stations.forEach(station => {
      // Create a custom marker element
      const el = document.createElement('div');
      el.className = 'ev-marker';
      
      // Check if this station is in favorites
      const isFavorite = favorites.includes(station.id);
      
      el.innerHTML = `
        <div class="marker-icon ${station.available > 0 ? 'available' : 'unavailable'} ${isFavorite ? 'favorite' : ''}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-battery-charging"><path d="M14 9h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"/><path d="M6 11V8a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1"/><path d="m10 14-2 2v-3"/><path d="M7 9a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2"/></svg>
        </div>
        <div class="marker-pulse ${isFavorite ? 'favorite-pulse' : ''}"></div>
      `;
      
      // Create popup content
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="flex flex-col p-2">
          <h3 class="font-semibold text-sm">${station.name}</h3>
          <p class="text-xs">${station.available}/${station.total} available</p>
          ${isFavorite ? '<p class="text-xs text-amber-600 font-semibold">★ Favorite</p>' : ''}
        </div>
      `);

      // Add marker to map
      const marker = new mapboxgl.Marker(el)
        .setLngLat([station.longitude, station.latitude])
        .setPopup(popup)
        .addTo(map.current!);
      
      // Store marker reference
      markersRef.current[station.id] = marker;
      
      // Add click handler
      el.addEventListener('click', () => {
        if (onStationSelect) {
          onStationSelect(station.id);
        }
      });
    });
  }, [stations, mapInitialized, onStationSelect, favorites]);

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-lg mb-8">
      <div ref={mapContainer} className="absolute inset-0" />
      <style>
        {`
        .ev-marker {
          position: relative;
          width: 32px;
          height: 32px;
          cursor: pointer;
        }
        .marker-icon {
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          z-index: 2;
        }
        .marker-icon svg {
          color: #1890ff;
        }
        .marker-icon.unavailable svg {
          color: #ea384c;
        }
        .marker-icon.favorite {
          background: #fff0b3;
          border: 2px solid #ffbb00;
        }
        .marker-pulse {
          position: absolute;
          top: 0;
          left: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(24, 144, 255, 0.4);
          opacity: 0.7;
          z-index: 1;
          animation: pulse 1.5s infinite;
        }
        .marker-pulse.favorite-pulse {
          background: rgba(255, 187, 0, 0.4);
        }
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.4;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.7;
          }
        }
        `}
      </style>
    </div>
  );
};

export default EVStationMap;
