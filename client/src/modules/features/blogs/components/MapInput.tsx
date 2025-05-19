import { useThemeContext } from "@/modules/core/context/ThemeContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

interface Props {
  lat: number;
  lng: number;
  onChange: (coords: { lat: number; lng: number }) => void;
}

const DraggableMarker = ({ lat, lng, onChange }: Props) => {
  const markerRef = useRef<L.Marker>(null);

  const { COLORS } = useThemeContext();

  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      marker.on("dragend", () => {
        const position = marker.getLatLng();
        onChange({ lat: position.lat, lng: position.lng });
      });
    }
  }, [onChange]);

  const customSvgIcon = L.divIcon({
    className: "",
    html: `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="${COLORS.primary[500]}"
        viewBox="0 0 24 24"
        className="icon icon-tabler icons-tabler-filled icon-tabler-map-pin"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" />
      </svg>
  `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <Marker
      draggable
      position={[lat, lng]}
      ref={markerRef}
      icon={customSvgIcon}
    />
  );
};

const MapInput = ({ lat, lng, onChange }: Props) => {
  return (
    <div className="w-full h-full rounded-lg border border-alto-300/70 dark:border-alto-800 overflow-hidden shadow">
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>`}
          subdomains="abcd"
          maxZoom={20}
          url={`https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`}
        />
        <DraggableMarker lat={lat} lng={lng} onChange={onChange} />
      </MapContainer>
    </div>
  );
};

export default MapInput;
