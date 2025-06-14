
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { BatteryCharging } from 'lucide-react';

// Add your Mapbox token here
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
  favorites?: number[];
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
      center: [77.2090, 28.6139], // Center on Delhi, India
      zoom: 5,
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

  // Update markers when stations change
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-battery-charging">
            <path d="M14 9h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2"/>
            <path d="M6 11V8a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1"/>
            <path d="m10 14-2 2v-3"/>
            <path d="M7 9a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2"/>
          </svg>
        </div>
        ${isFavorite ? '<div class="marker-pulse favorite-pulse"></div>' : '<div class="marker-pulse"></div>'}
      `;
      
      // Create popup content
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: true,
        closeOnClick: false 
      }).setHTML(`
        <div class="flex flex-col p-3 min-w-[200px]">
          <h3 class="font-semibold text-base mb-2">${station.name}</h3>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600">Available:</span>
            <span class="text-sm font-medium ${station.available > 0 ? 'text-green-600' : 'text-red-600'}">
              ${station.available}/${station.total}
            </span>
          </div>
          ${isFavorite ? '<div class="flex items-center gap-1 text-amber-600 text-sm font-medium"><span>★</span> Favorite</div>' : ''}
          <button 
            onclick="window.selectStation && window.selectStation(${station.id})" 
            class="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
          >
            View Details
          </button>
        </div>
      `);

      // Add marker to map with better positioning
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat([station.longitude, station.latitude])
        .setPopup(popup)
        .addTo(map.current!);
      
      // Store marker reference
      markersRef.current[station.id] = marker;
      
      // Add click handler
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onStationSelect) {
          onStationSelect(station.id);
        }
      });
    });

    // Add global station selector function for popup buttons
    (window as any).selectStation = (stationId: number) => {
      if (onStationSelect) {
        onStationSelect(stationId);
      }
    };

    // Fit map to show all stations with padding
    if (stations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      stations.forEach(station => {
        bounds.extend([station.longitude, station.latitude]);
      });
      
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 12
      });
    }
  }, [stations, mapInitialized, onStationSelect, favorites]);

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-lg mb-8">
      <div ref={mapContainer} className="absolute inset-0" />
      <style>
        {`
        .ev-marker {
          position: relative;
          width: 36px;
          height: 36px;
          cursor: pointer;
          z-index: 100;
        }
        .marker-icon {
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          z-index: 2;
          border: 2px solid #1890ff;
          transition: all 0.2s ease;
        }
        .marker-icon:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        .marker-icon svg {
          color: #1890ff;
        }
        .marker-icon.unavailable {
          border-color: #ea384c;
        }
        .marker-icon.unavailable svg {
          color: #ea384c;
        }
        .marker-icon.favorite {
          background: #fff0b3;
          border-color: #ffbb00;
          box-shadow: 0 2px 8px rgba(255, 187, 0, 0.4);
        }
        .marker-icon.favorite svg {
          color: #ffbb00;
        }
        .marker-pulse {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(24, 144, 255, 0.3);
          opacity: 0.7;
          z-index: 1;
          animation: pulse 2s infinite;
        }
        .marker-pulse.favorite-pulse {
          background: rgba(255, 187, 0, 0.3);
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.4);
            opacity: 0.3;
          }
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
        }

        .mapboxgl-popup-content {
          padding: 0;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          border: 1px solid #e5e7eb;
        }
        
        .mapboxgl-popup-tip {
          border-top-color: white;
        }
        `}
      </style>
      <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-lg shadow backdrop-blur-sm z-10">
        <p className="text-sm font-medium">EV Charging Stations</p>
        <p className="text-xs text-gray-500 mt-1">Click markers to view details</p>
      </div>
    </div>
  );
};

export default EVStationMap;
