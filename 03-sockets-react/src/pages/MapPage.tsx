import "./MapPage.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { useSocketMap } from "../hooks/useSocketMap";
import { ConnectForm } from "../components/ConnectForm";

export const MapPage = () => {
  const { mapContainer, map, connectToServer } = useSocketMap();

  const handleSubmit = (name: string, color: string) => {
    const currentLocation = map.current?.getCenter();
    if (!currentLocation) return;

    connectToServer(name, color, {
      lat: currentLocation?.lat,
      lng: currentLocation?.lng,
    });
  };

  return (
    <>
      <ConnectForm onSubmit={handleSubmit} />
      <div className="map-container" ref={mapContainer}></div>
    </>
  );
};
