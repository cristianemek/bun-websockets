import { use, useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { WebSocketContext } from "../context/WebSocketContext";
import Cookies from "js-cookie";
import type { Client } from "../types";
import type { SocketResponse } from "../context/WebSocketContext";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY203eXd1a3ZzMGV1ejJrcHRvdnVoYng0NCJ9.NzlqpAcLHejzezQqazzI-w#";

const clientMarkers = new Map<string, mapboxgl.Marker>();

export const useSocketMap = () => {
  const { status, connectToServer, subscribeToMessages, send } =
    use(WebSocketContext);
  const [me, setme] = useState<Client | null>(null);

  const mapContainer = useRef<HTMLDivElement>(null);

  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const name = Cookies.get("name");
    const color = Cookies.get("color");
    const coordsString = Cookies.get("coords");

    if (!name || !color || !coordsString || status !== "offline") return;

    const coords = JSON.parse(coordsString) as { lat: number; lng: number };

    connectToServer(name, color, coords);
  }, [connectToServer, status]);

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

  const createMarker = useCallback(
    (client: Client, draggable: boolean = false) => {
      if (!map.current) return;
      if (clientMarkers.has(client.clientId)) return;

      const marker = new mapboxgl.Marker({
        color: client.color || "gray",
      })
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<h3 style="color:${client.color}">${client.name}</h3>`,
          ),
        )
        .addTo(map.current)
        .setDraggable(draggable)
        .setLngLat([client.coords.lng, client.coords.lat])
        .on("drag", (event) => {
          Cookies.set("coords", JSON.stringify(event.target.getLngLat()));
          send({
            type: 'CLIENT_MOVE',
            payload: {
              clientId: client.clientId,
              coords: event.target.getLngLat(),
            }
          })
        });

      clientMarkers.set(client.clientId, marker);
    },
    [send],
  );

  const moveMarker = useCallback((client: Client) => {
    const marker = clientMarkers.get(client.clientId);
    if (!marker) return;

    marker.setLngLat([client.coords.lng, client.coords.lat]);
  }, []);

  const removeMarker = useCallback((clientId: string) => {
    if (!clientMarkers.has(clientId)) return;
    const marker = clientMarkers.get(clientId);
    if (!marker) return;

    marker.remove();
    clientMarkers.delete(clientId);
  }, []);

  const handleResponse = useCallback(
    (response: SocketResponse) => {
      const { type, payload } = response;

      switch (type) {
        case "WELCOME":
          setme(payload);
          createMarker(payload, true);
          break;
        case "CLIENT_STATE":
          payload.forEach((client) => createMarker(client, false));
          break;
        case "CLIENT_JOINED":
          createMarker(payload, false);
          break;
        case "CLIENT_MOVED":
          moveMarker(payload);
          break;
        case "CLIENT_LEFT":
          removeMarker(payload.clientId);
          break;
        case "ERROR":
          alert(payload.message);
          break;
      }
    },
    [createMarker, moveMarker, removeMarker],
  );

  useEffect(() => {
    return subscribeToMessages(handleResponse);
  }, [subscribeToMessages, handleResponse]);

  return {
    map,
    me,
    mapContainer,
    connectToServer,
  };
};
