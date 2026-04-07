import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet"
import { useEffect, useState } from "react"
import { getBins, updateBin } from "../services/api"
import L from "leaflet"

// 🚛 TRUCK ICON
const truckIcon = L.divIcon({
  html: "🚛",
  className: "truck-icon",
  iconSize: [40, 40]
})

// 🏭 FACTORY ICON
const factoryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2906/2906274.png",
  iconSize: [40, 40]
})

export default function RoutePage() {

  const [bins, setBins] = useState([])
  const [truckPos, setTruckPos] = useState(null)
  const [visited, setVisited] = useState([])
  const [pathLine, setPathLine] = useState([])

  const dumpYard = [12.9716, 77.5946]

  const binIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484662.png",
    iconSize: [30, 30]
  })

  // 🔄 Load bins
  function load() {
    getBins().then(res => setBins(res.data || []))
  }

  useEffect(() => {
    load()
  }, [])

  // ✅ SAFE FILTER (VERY IMPORTANT)
  const validBins = bins.filter(
    b =>
      !isNaN(Number(b.Latitude)) &&
      !isNaN(Number(b.Longitude))
  )

  // 🚀 START COLLECTION
  function startCollection() {

    const selected = [...validBins]
      .sort((a, b) => b.Waste_Level - a.Waste_Level)
      .slice(0, 7)

    const path = [
      dumpYard,
      ...selected.map(b => [
        Number(b.Latitude),
        Number(b.Longitude)
      ]),
      dumpYard
    ]

    let i = 0

    function move() {

      if (i < path.length) {

        const pos = path[i]

        // 🔥 SAFETY CHECK
        if (!pos || isNaN(pos[0]) || isNaN(pos[1])) {
          i++
          move()
          return
        }

        // 🚛 move truck
        setTruckPos(pos)

        // 🔵 draw path
        setPathLine(prev => [...prev, pos])

        // 🗑 empty bin
        if (i > 0 && i <= selected.length) {
          const bin = selected[i - 1]

          updateBin({
            Bin_ID: bin.Bin_ID,
            Waste_Level: 0
          })

          setVisited(prev => [...prev, bin])
        }

        i++
        setTimeout(move, 1000)

      } else {
        load()
      }
    }

    setTruckPos(dumpYard)
    setVisited([])
    setPathLine([])
    move()
  }

  return (
    <div style={{ display: "flex", gap: "20px" }}>

      {/* 📋 VISITED LIST */}
      <div style={{
        width: "300px",
        background: "#1e293b",
        padding: "10px",
        borderRadius: "10px",
        maxHeight: "500px",
        overflowY: "auto"
      }}>
        <h3>🧾 Collected Bins</h3>

        {visited.map(b => (
          <div key={b.Bin_ID} style={{
            marginBottom: "10px",
            background: "#334155",
            padding: "8px",
            borderRadius: "6px"
          }}>
            {b.Area} ✔
          </div>
        ))}
      </div>

      {/* 🗺 MAP */}
      <div style={{ flex: 1 }}>

        <h2>🚛 Smart Route System</h2>

        <button onClick={startCollection}>
          Start Collection
        </button>

        <MapContainer
          center={dumpYard}
          zoom={13}
          style={{ height: "500px", width: "100%" }}
        >

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* 🏭 Dumpyard */}
          <Marker position={dumpYard} icon={factoryIcon} />

          {/* 🗑 BINS (SAFE) */}
          {validBins.map(b => (
            <Marker
              key={b.Bin_ID}
              position={[
                Number(b.Latitude),
                Number(b.Longitude)
              ]}
              icon={binIcon}
            />
          ))}

          {/* 🔵 ROUTE LINE */}
          <Polyline positions={pathLine} color="blue" />

          {/* 🚛 TRUCK */}
          {truckPos && (
            <Marker position={truckPos} icon={truckIcon} />
          )}

        </MapContainer>

      </div>

    </div>
  )
}