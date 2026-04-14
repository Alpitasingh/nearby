import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix marker icons
const icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = icon;

export default function Map({ userLocation, tasks }) {
  // 🔥 SAFETY CHECKS (VERY IMPORTANT)
  if (!userLocation || !userLocation.lat || !userLocation.lng) {
    return <div className="p-4 text-sm text-gray-500">Loading map...</div>;
  }

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* User marker */}
      <Marker position={[userLocation.lat, userLocation.lng]}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Tasks markers */}
      {safeTasks.map((task, i) => {
        // 🔥 extra safety (avoid crash)
        if (
          !task?.location?.coordinates ||
          task.location.coordinates.length < 2
        ) {
          return null;
        }

        return (
          <Marker
            key={i}
            position={[
              task.location.coordinates[1], // lat
              task.location.coordinates[0], // lng
            ]}
          >
            <Popup>{task.title || "Task"}</Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}