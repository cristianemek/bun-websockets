import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken =
  "pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY203eXd1a3ZzMGV1ejJrcHRvdnVoYng0NCJ9.NzlqpAcLHejzezQqazzI-w#";

export const useSocketMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);

  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return;

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-122.467895, 37.800126],
        zoom: 14.5,
        attributionControl: false,
      });
    }
  }, []);

  return {
    mapContainer,
    map,
  };
};
