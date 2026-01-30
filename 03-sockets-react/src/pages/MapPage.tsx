import './MapPage.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import { useSocketMap } from '../hooks/useSocketMap';


export const MapPage = () => {

    const { mapContainer } = useSocketMap();

  return (
    <>
        <div className="map-container" ref={mapContainer}></div>
    </>
  )
}
