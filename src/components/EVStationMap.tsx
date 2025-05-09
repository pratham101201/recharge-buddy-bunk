
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
  const [clusterMode, setClusterMode] = useState(stations.length > 50);

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

  // Set up cluster source and layer when map initializes
  useEffect(() => {
    if (!map.current || !mapInitialized) return;

    // Check if we need to use clustering based on station count
    const shouldUseCluster = stations.length > 50;
    setClusterMode(shouldUseCluster);

    if (shouldUseCluster) {
      // Add cluster source if it doesn't exist
      if (!map.current.getSource('stations')) {
        map.current.addSource('stations', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50
        });

        // Add clusters layer
        map.current.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'stations',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              20, '#f1f075',
              100, '#f28cb1'
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              20, 30,
              100, 40
            ]
          }
        });

        // Add cluster count layer
        map.current.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'stations',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          }
        });

        // Add unclustered point layer
        map.current.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'stations',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#11b4da',
            'circle-radius': 8,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
          }
        });

        // Handle click events on clusters
        map.current.on('click', 'clusters', (e) => {
          const features = map.current?.queryRenderedFeatures(e.point, {
            layers: ['clusters']
          });
          
          if (!features?.length) return;
          
          const clusterId = features[0].properties?.cluster_id;
          const source = map.current?.getSource('stations') as mapboxgl.GeoJSONSource;
          
          source.getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
              if (err || !map.current) return;
              
              map.current.easeTo({
                center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
                zoom: zoom
              });
            }
          );
        });

        // Change cursor on cluster hover
        map.current.on('mouseenter', 'clusters', () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });
        
        map.current.on('mouseleave', 'clusters', () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });

        // Handle click on unclustered points
        map.current.on('click', 'unclustered-point', (e) => {
          if (!e.features?.length) return;
          
          const coordinates = (e.features[0].geometry as GeoJSON.Point).coordinates.slice() as [number, number];
          const stationId = e.features[0].properties?.id;
          
          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          
          if (onStationSelect && stationId) {
            onStationSelect(parseInt(stationId));
          }
        });

        // Change cursor on unclustered point hover
        map.current.on('mouseenter', 'unclustered-point', () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });
        
        map.current.on('mouseleave', 'unclustered-point', () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });
      }
    }
  }, [mapInitialized, stations.length]);

  // Update marker data when stations change
  useEffect(() => {
    if (!map.current || !mapInitialized) return;
    
    if (clusterMode) {
      // Update the GeoJSON data for clustering
      const features = stations.map(station => ({
        type: 'Feature' as const,
        properties: {
          id: station.id,
          name: station.name,
          available: station.available,
          total: station.total,
          isFavorite: favorites.includes(station.id)
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [station.longitude, station.latitude]
        }
      }));

      const source = map.current.getSource('stations') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          features: features
        });
      }

      // Remove any existing markers when in cluster mode
      Object.values(markersRef.current).forEach(marker => marker.remove());
      markersRef.current = {};
    } else {
      // For fewer stations, use individual markers for better control
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
    }
  }, [stations, mapInitialized, onStationSelect, favorites, clusterMode]);

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

        .mapboxgl-popup-content {
          padding: 10px;
          border-radius: 8px;
        }
        `}
      </style>
      {clusterMode && (
        <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow backdrop-blur-sm z-10">
          <p className="text-sm">Showing stations in cluster mode for better performance</p>
          <p className="text-xs text-gray-500 mt-1">Zoom in to view individual stations</p>
        </div>
      )}
    </div>
  );
};

export default EVStationMap;
