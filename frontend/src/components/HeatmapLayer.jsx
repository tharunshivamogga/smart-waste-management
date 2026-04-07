import { MapContainer, TileLayer, CircleMarker } from "react-leaflet"
import { useEffect, useState } from "react"
import { getBins } from "../services/api"
import "leaflet/dist/leaflet.css"
export default function MapPage() {

  const [bins, setBins] = useState([])

  useEffect(() => {
    getBins().then(res => setBins(res.data || []))
  }, [])

  return (
    <div className="page">

      <h2>🗺 Debug Map</h2>

      <MapContainer
        center={[12.97, 77.59]}
        zoom={14}
        style={{ height: "500px", width: "100%" }}  // 🔥 FORCE HEIGHT
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

        {bins.map(b => (
          <CircleMarker
            key={b.Bin_ID}
            center={[b.Latitude, b.Longitude]}
            radius={10}
            pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.8 }}
          />
        ))}

      </MapContainer>

    </div>
  )
}