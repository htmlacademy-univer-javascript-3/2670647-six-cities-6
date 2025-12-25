import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Place = {
  id: string;
  city?: { name: string; location: { latitude: number; longitude: number } };
  location?: { latitude: number; longitude: number };
};

type Props = {
  places: Place[];
  cityName?: string;
  containerClassName?: string;
  height?: number | string;
  activeOfferId?: string | null;
};

const Map: React.FC<Props> = ({
  places,
  cityName,
  containerClassName = 'cities__map map',
  height,
  activeOfferId,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const offersLayerRef = useRef<L.LayerGroup | null>(null);
  const markersMapRef = useRef<Record<string, L.Marker> | null>(null);
  const activeMarkerRef = useRef<L.Marker | null>(null);
  const defaultIconRef = useRef<L.Icon | null>(null);
  const activeIconRef = useRef<L.Icon | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current, {
        center: [52.38333, 4.9],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(leafletMap.current);
    }

    const map = leafletMap.current;
    if (!map) {
      return;
    }
    const existing = offersLayerRef.current;
    if (existing) {
      map.removeLayer(existing);
      offersLayerRef.current = null;
    }

    const markers = L.layerGroup();

    if (!defaultIconRef.current) {
      defaultIconRef.current = L.icon({
        iconUrl: '/img/pin.svg',
        iconSize: [27, 39],
        iconAnchor: [13, 39],
      });
    }
    if (!activeIconRef.current) {
      activeIconRef.current = L.icon({
        iconUrl: '/img/pin-active.svg',
        iconSize: [27, 39],
        iconAnchor: [13, 39],
      });
    }

    markersMapRef.current = {};

    places
      .filter((p) => p.city && p.city.name === cityName)
      .forEach((p) => {
        // prefer place-level location if present, otherwise use city location
        const lat = p.location?.latitude ?? p.city?.location?.latitude;
        const lng = p.location?.longitude ?? p.city?.location?.longitude;
        // skip invalid coordinates
        if (typeof lat !== 'number' || typeof lng !== 'number') {
          return;
        }
        const marker = L.marker([lat, lng], {
          icon: defaultIconRef.current!,
        });
        marker.addTo(markers);
        markersMapRef.current![p.id] = marker;
      });

    markers.addTo(map);
    offersLayerRef.current = markers;

    const latlngs: [number, number][] = [];
    places.forEach((p) => {
      if (p.city && p.city.name === cityName) {
        const lat = p.location?.latitude ?? p.city.location?.latitude;
        const lng = p.location?.longitude ?? p.city.location?.longitude;
        if (typeof lat === 'number' && typeof lng === 'number') {
          latlngs.push([lat, lng]);
        }
      }
    });

    if (latlngs.length > 0) {
      const bounds = L.latLngBounds(latlngs);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {};
  }, [places, cityName]);

  // react to activeOfferId changes
  useEffect(() => {
    if (!leafletMap.current) {
      return;
    }
    const markersMap = markersMapRef.current;
    if (!markersMap) {
      return;
    }

    const defaultIcon = defaultIconRef.current!;
    const activeIcon = activeIconRef.current!;

    // reset previous
    if (activeMarkerRef.current) {
      activeMarkerRef.current.setIcon(defaultIcon);
      activeMarkerRef.current = null;
    }

    if (typeof activeOfferId === 'string' && activeOfferId !== '') {
      const m = markersMap[activeOfferId];
      if (m) {
        m.setIcon(activeIcon);
        activeMarkerRef.current = m;
      }
    }
  }, [activeOfferId]);

  const styleHeight =
    typeof height === 'number' ? `${height}px` : height ?? '100%';

  return (
    <div
      ref={mapRef}
      className={containerClassName}
      style={{ height: styleHeight }}
    />
  );
};

export default Map;
