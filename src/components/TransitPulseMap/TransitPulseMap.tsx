// ==============================================================================
// TRANSIT PULSE MAP - Interactive Mapbox Map with Transit Layers
// ==============================================================================

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { TransitPulseMapProps, CommuteOverlayState } from './types';
import type { TransitData } from '../../types/components';
import MapControls from './MapControls';
import CommuteOverlay from './CommuteOverlay';
import transitData from '../../data/transit.json';
import './TransitPulseMap.css';

// Mapbox access token from environment
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

// SF bounds for initial view
const SF_CENTER: [number, number] = [-122.4194, 37.7749]; // [lng, lat]
const SF_ZOOM = 12;

export default function TransitPulseMap({
  daycares,
  filters,
  onDaycareClick,
}: TransitPulseMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  const [showTransitLayers, setShowTransitLayers] = useState(true);
  const [commuteOverlay, setCommuteOverlay] = useState<CommuteOverlayState>({
    workAddress: '',
    isActive: false,
    highlightedDaycares: [],
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: SF_CENTER,
      zoom: SF_ZOOM,
      pitch: 0,
      bearing: 0,
      maxBounds: [
        [transitData.sf_bounds.west, transitData.sf_bounds.south],
        [transitData.sf_bounds.east, transitData.sf_bounds.north],
      ],
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-left');

    // Disable rotation on mobile
    map.current.dragRotate.disable();
    map.current.touchZoomRotate.disableRotation();

    map.current.on('load', () => {
      addTransitLayers();
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add transit layers (BART stations, Muni lines, Slow Streets)
  const addTransitLayers = () => {
    if (!map.current) return;

    const mapInstance = map.current;
    const data = transitData as TransitData;

    // Add BART stations as markers
    data.bart_stations.forEach(station => {
      const el = document.createElement('div');
      el.className = 'bart-station-marker';
      el.innerHTML = '🔴';
      el.title = station.name;

      new mapboxgl.Marker(el)
        .setLngLat([station.lng, station.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<strong>${station.name}</strong><br/>BART Station`
          )
        )
        .addTo(mapInstance);
    });

    // Add Muni lines as GeoJSON
    data.muni_lines.forEach((line, index) => {
      const sourceId = `muni-line-${index}`;
      const layerId = `muni-line-layer-${index}`;

      mapInstance.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {
            name: line.name,
            color: line.color,
          },
          geometry: {
            type: 'LineString',
            coordinates: line.coordinates.map(coord => [coord[1], coord[0]]), // [lng, lat]
          },
        },
      });

      mapInstance.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': line.color,
          'line-width': 3,
          'line-opacity': 0.7,
        },
      });
    });

    // Add Slow Streets
    if (data.slow_streets) {
      data.slow_streets.forEach((street, index) => {
        const sourceId = `slow-street-${index}`;
        const layerId = `slow-street-layer-${index}`;

        mapInstance.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {
              name: street.name,
            },
            geometry: {
              type: 'LineString',
              coordinates: street.coordinates.map(coord => [coord[1], coord[0]]),
            },
          },
        });

        mapInstance.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': street.color,
            'line-width': 4,
            'line-dasharray': [2, 2],
            'line-opacity': 0.6,
          },
        });
      });
    }
  };

  // Update daycare markers
  useEffect(() => {
    if (!map.current) return;

    const mapInstance = map.current;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Filter daycares based on filters
    let filteredDaycares = daycares.filter(
      d => d.location.latitude && d.location.longitude
    );

    // Add new markers
    filteredDaycares.forEach(daycare => {
      const el = document.createElement('div');

      // Check if daycare has immediate openings
      const hasImmediateOpenings =
        daycare.availability.accepting_enrollment &&
        (daycare.availability.infant_spots > 0 ||
          daycare.availability.toddler_spots > 0 ||
          daycare.availability.preschool_spots > 0);

      // Check if highlighted by commute overlay
      const isHighlighted = commuteOverlay.highlightedDaycares.includes(daycare.id);

      el.className = `daycare-marker ${hasImmediateOpenings ? 'has-openings' : ''} ${
        isHighlighted ? 'highlighted' : ''
      } ${daycare.premium.is_premium ? 'premium' : ''}`;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([daycare.location.longitude, daycare.location.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25, maxWidth: '300px' }).setHTML(`
            <div class="map-popup">
              <h4>${daycare.name}</h4>
              <p>${daycare.location.neighborhood.replace(/-/g, ' ')}</p>
              <div class="map-popup-rating">
                <span>⭐ ${daycare.ratings.overall}</span>
                <span>${daycare.ratings.review_count} reviews</span>
              </div>
              ${
                hasImmediateOpenings
                  ? '<div class="map-popup-badge">Immediate Openings</div>'
                  : ''
              }
            </div>
          `)
        )
        .addTo(mapInstance);

      // Click handler
      el.addEventListener('click', () => {
        if (onDaycareClick) {
          onDaycareClick(daycare.id);
        }
      });

      markers.current.push(marker);
    });
  }, [daycares, filters, commuteOverlay.highlightedDaycares, onDaycareClick]);

  // Map controls handlers
  const handleZoomIn = () => {
    map.current?.zoomIn();
  };

  const handleZoomOut = () => {
    map.current?.zoomOut();
  };

  const handleResetView = () => {
    map.current?.flyTo({
      center: SF_CENTER,
      zoom: SF_ZOOM,
      pitch: 0,
      bearing: 0,
    });
  };

  const handleToggleTransitLayers = () => {
    setShowTransitLayers(!showTransitLayers);
    // Toggle visibility of transit layers
    if (map.current) {
      const visibility = showTransitLayers ? 'none' : 'visible';
      const data = transitData as TransitData;

      data.muni_lines.forEach((_, index) => {
        const layerId = `muni-line-layer-${index}`;
        if (map.current?.getLayer(layerId)) {
          map.current.setLayoutProperty(layerId, 'visibility', visibility);
        }
      });

      if (data.slow_streets) {
        data.slow_streets.forEach((_, index) => {
          const layerId = `slow-street-layer-${index}`;
          if (map.current?.getLayer(layerId)) {
            map.current.setLayoutProperty(layerId, 'visibility', visibility);
          }
        });
      }
    }
  };

  const handleToggleCommuteOverlay = () => {
    setCommuteOverlay(prev => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };

  // Commute overlay handlers
  const handleActivateCommute = () => {
    // Mock implementation: Highlight daycares near BART stations
    const data = transitData as TransitData;
    const nearbyDaycares = daycares
      .filter(daycare => {
        return data.bart_stations.some(station => {
          const distance = calculateDistance(
            daycare.location.latitude,
            daycare.location.longitude,
            station.lat,
            station.lng
          );
          return distance < 0.5; // Within ~0.5km (5-min walk)
        });
      })
      .map(d => d.id);

    setCommuteOverlay(prev => ({
      ...prev,
      isActive: true,
      highlightedDaycares: nearbyDaycares,
    }));
  };

  const handleDeactivateCommute = () => {
    setCommuteOverlay({
      workAddress: '',
      isActive: false,
      highlightedDaycares: [],
    });
  };

  // Helper to calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  return (
    <div className="transit-pulse-map-wrapper">
      <div ref={mapContainer} className="transit-pulse-map" />

      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        onToggleTransitLayers={handleToggleTransitLayers}
        onToggleCommuteOverlay={handleToggleCommuteOverlay}
        showTransitLayers={!showTransitLayers}
        commuteMode={commuteOverlay.isActive}
      />

      <CommuteOverlay
        workAddress={commuteOverlay.workAddress}
        onWorkAddressChange={(address) =>
          setCommuteOverlay(prev => ({ ...prev, workAddress: address }))
        }
        onActivate={handleActivateCommute}
        onDeactivate={handleDeactivateCommute}
        isActive={commuteOverlay.isActive}
      />

      {/* Legend */}
      <div className="map-legend">
        <h4>Legend</h4>
        <div className="legend-item">
          <span className="legend-marker standard"></span>
          <span>Daycare</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker has-openings"></span>
          <span>Immediate Openings</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker premium"></span>
          <span>Premium Listing</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">🔴</span>
          <span>BART Station</span>
        </div>
      </div>
    </div>
  );
}
