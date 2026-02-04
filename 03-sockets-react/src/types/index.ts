export interface Client {
  clientId: string;
  name: string;
  color: string;
  coords: LatLng;
}

export interface LatLng {
  lat: number;
  lng: number;
}