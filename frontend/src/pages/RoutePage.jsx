import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  CircleMarker
} from "react-leaflet"
import { useEffect, useState } from "react"
import { getBins, updateBin } from "../services/api"
import L from "leaflet"

// 🚛 Truck Icon
const truckIcon = L.divIcon({
  html: "🚛",
  className: "truck-icon",
  iconSize: [40, 40]
})

// 🏭 Dumpyard Icon
const factoryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2906/2906274.png",
  iconSize: [40, 40]
})

// 🗑 Bin Icon
const binIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484662.png",
  iconSize: [30, 30]
})

export default function RoutePage() {

  const [bins, setBins] = useState([])
  const [truckPos, setTruckPos] = useState(null)
  const [pathLine, setPathLine] = useState([])
  const [visited, setVisited] = useState([])
  const [selected, setSelected] = useState([])
  const [distanceText, setDistanceText] = useState("")

  const dumpYard = [12.9716, 77.5946]

  useEffect(() => {
    getBins().then(res => setBins(res.data || []))
  }, [])

  const validBins = bins.filter(
    b => !isNaN(Number(b.Latitude)) && !isNaN(Number(b.Longitude))
  )

  // 📏 Distance
  function distance(a, b) {
    const dx = a[0] - b[0]
    const dy = a[1] - b[1]
    return Math.sqrt(dx * dx + dy * dy)
  }

  // 📏 Total distance
  function totalDistance(path) {
    let d = 0
    for (let i = 0; i < path.length - 1; i++) {
      d += distance(path[i], path[i + 1])
    }
    return d
  }

  // 📏 Format KM
  function formatDistance(d) {
    return `${(d * 111).toFixed(2)} km`
  }

  // 🧠 Nearest Neighbor
  function optimizeRoute(binList) {
    let remaining = [...binList]
    let current = dumpYard
    let ordered = []

    while (remaining.length) {
      let nearest = remaining.reduce((prev, curr) => {
        return distance(current, [curr.Latitude, curr.Longitude]) <
          distance(current, [prev.Latitude, prev.Longitude])
          ? curr : prev
      })

      ordered.push(nearest)
      current = [nearest.Latitude, nearest.Longitude]
      remaining = remaining.filter(b => b !== nearest)
    }

    return ordered
  }

  // 🚛 Smooth Animation
  function animateMove(start, end, callback) {
    let step = 0
    const steps = 40

    const interval = setInterval(() => {
      step++

      const lat = start[0] + (end[0] - start[0]) * (step / steps)
      const lng = start[1] + (end[1] - start[1]) * (step / steps)

      setTruckPos([lat, lng])
      setPathLine(prev => [...prev, [lat, lng]])

      if (step >= steps) {
        clearInterval(interval)
        callback()
      }
    }, 40)
  }

  // 🚀 Start Collection
  function startCollection() {

    const topBins = [...validBins]
      .sort((a, b) => b.Waste_Level - a.Waste_Level)
      .slice(0, 7)

    const ordered = optimizeRoute(topBins)
    setSelected(ordered)

    const path = [
      dumpYard,
      ...ordered.map(b => [b.Latitude, b.Longitude]),
      dumpYard
    ]

    setDistanceText(formatDistance(totalDistance(path)))

    let i = 0

    function move() {
      if (i < path.length - 1) {

        animateMove(path[i], path[i + 1], () => {

          if (i > 0 && i <= ordered.length) {
            updateBin({
              Bin_ID: ordered[i - 1].Bin_ID,
              Waste_Level: 0
            })

            setVisited(prev => [...prev, ordered[i - 1]])
          }

          i++
          move()
        })
      }
    }

    setTruckPos(dumpYard)
    setVisited([])
    setPathLine([])
    move()
  }

 return (
  <div className="page">

    <h1>🚛 Smart Route Dashboard</h1>

    {/* BUTTON */}
   <button onClick={startCollection} style={{ marginBottom: "10px" }}>
      Start Collection
    </button>

    <div className="card">
  <h3>Distance: {distanceText}</h3>
</div>

    <div className="cards">

      {/* LEFT SIDE */}
      <div className="card">
        <h3>🧾 Collected Bins</h3>

        {visited.length === 0 && <p>No bins collected</p>}

        {visited.map(b => (
          <div key={b.Bin_ID} className="alert">
            {b.Area} ✔
          </div>
        ))}
      </div>

      {/* RIGHT SIDE MAP */}
      <div className="card">

        <MapContainer
          center={dumpYard}
          zoom={13}
          style={{ height: "500px", width: "100%" }}
        >

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={dumpYard} icon={factoryIcon} />

          {validBins.map(b => {

            const isNext =
              selected.length > 0 &&
              b.Bin_ID === selected[visited.length]?.Bin_ID

            return (
              <Marker
                key={b.Bin_ID}
                position={[b.Latitude, b.Longitude]}
                icon={binIcon}
              >
                {isNext && (
                  <CircleMarker
                    center={[b.Latitude, b.Longitude]}
                    radius={20}
                    pathOptions={{ color: "red" }}
                    className="blink"
                  />
                )}
              </Marker>
            )
          })}

          <Polyline positions={pathLine} color="blue" />

          {truckPos && (
            <Marker position={truckPos} icon={truckIcon} />
          )}

        </MapContainer>

      </div>

    </div>

  </div>
)}