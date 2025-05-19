import { useEffect, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { useThemeContext } from "@/modules/core/context/ThemeContext";
import "leaflet/dist/leaflet.css";

interface Props {
  lat: number;
  lng: number;
  onChange: (coords: { lat: number; lng: number }) => void;
}

const DraggableMarker = ({ lat, lng, onChange }: Props) => {
  const markerRef = useRef<L.Marker>(null);

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

  return <Marker draggable position={[lat, lng]} ref={markerRef} />;
};

const MapInput = ({ lat, lng, onChange }: Props) => {
  const { dark } = useThemeContext();
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
          url={`https://{s}.basemaps.cartocdn.com/${
            dark ? "dark" : "light"
          }_all/{z}/{x}/{y}{r}.png`}
        />
        <DraggableMarker lat={lat} lng={lng} onChange={onChange} />
      </MapContainer>
    </div>
  );
};

export default MapInput;
