import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface DeliveryMapProps {
  restaurantLocation?: { lat: number; lng: number };
  deliveryLocation?: { lat: number; lng: number };
  partnerLocation?: { lat: number; lng: number };
  className?: string;
}

export function DeliveryMap({
  restaurantLocation,
  deliveryLocation,
  partnerLocation,
  className = "",
}: DeliveryMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const partnerMarker = useRef<maplibregl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const defaultCenter = { lat: 12.9716, lng: 77.5946 };

  const center = partnerLocation || restaurantLocation || defaultCenter;

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [center.lng, center.lat],
      zoom: 14,
    });

    map.current.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "top-right"
    );

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (restaurantLocation) {
      const el = document.createElement("div");
      el.className = "restaurant-marker";
      el.innerHTML = `
        <div style="
          width: 36px;
          height: 36px;
          background: hsl(25 95% 48%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
            <path d="M7 2v20"/>
            <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
          </svg>
        </div>
      `;

      new maplibregl.Marker({ element: el })
        .setLngLat([restaurantLocation.lng, restaurantLocation.lat])
        .addTo(map.current);
    }

    if (deliveryLocation) {
      const el = document.createElement("div");
      el.className = "delivery-marker";
      el.innerHTML = `
        <div style="
          width: 36px;
          height: 36px;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      `;

      new maplibregl.Marker({ element: el })
        .setLngLat([deliveryLocation.lng, deliveryLocation.lat])
        .addTo(map.current);
    }
  }, [mapLoaded, restaurantLocation, deliveryLocation]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (partnerLocation) {
      if (partnerMarker.current) {
        partnerMarker.current.setLngLat([partnerLocation.lng, partnerLocation.lat]);
      } else {
        const el = document.createElement("div");
        el.className = "partner-marker";
        el.innerHTML = `
          <div style="
            width: 40px;
            height: 40px;
            background: #3b82f6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid white;
            box-shadow: 0 2px 12px rgba(59,130,246,0.5);
            animation: pulse 2s ease-in-out infinite;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
            </svg>
          </div>
        `;

        partnerMarker.current = new maplibregl.Marker({ element: el })
          .setLngLat([partnerLocation.lng, partnerLocation.lat])
          .addTo(map.current);
      }

      map.current.flyTo({
        center: [partnerLocation.lng, partnerLocation.lat],
        duration: 1000,
      });
    }
  }, [mapLoaded, partnerLocation]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const bounds = new maplibregl.LngLatBounds();
    let hasPoints = false;

    if (restaurantLocation) {
      bounds.extend([restaurantLocation.lng, restaurantLocation.lat]);
      hasPoints = true;
    }
    if (deliveryLocation) {
      bounds.extend([deliveryLocation.lng, deliveryLocation.lat]);
      hasPoints = true;
    }
    if (partnerLocation) {
      bounds.extend([partnerLocation.lng, partnerLocation.lat]);
      hasPoints = true;
    }

    if (hasPoints) {
      map.current.fitBounds(bounds, {
        padding: 60,
        maxZoom: 15,
        duration: 500,
      });
    }
  }, [mapLoaded, restaurantLocation, deliveryLocation, partnerLocation]);

  return (
    <div
      ref={mapContainer}
      className={`w-full h-full ${className}`}
      data-testid="delivery-map"
    />
  );
}