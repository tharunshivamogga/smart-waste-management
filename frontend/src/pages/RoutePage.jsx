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
    b =>
      !isNaN(Number(b.Latitude)) &&
      !isNaN(Number(b.Longitude))
  )

  function distance(a, b) {
    const dx = a[0] - b[0]
    const dy = a[1] - b[1]
    return Math.sqrt(dx * dx + dy * dy)
  }

  function totalDistance(path) {
    let d = 0
    for (let i = 0; i < path.length - 1; i++) {
      d += distance(path[i], path[i + 1])
    }
    return d
  }

  function formatDistance(d) {
    return `${(d * 111).toFixed(2)} km`
  }

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

  function startCollection() {

    const topBins = [...validBins]
      .sort((a, b) => b.Waste_Level - a.Waste_Level)
      .slice(0, 7)

    const ordered = optimizeRoute(topBins)

    setSelected(ordered)

    const path = [
      dumpYard,
      ...ordered.map(b => [Number(b.Latitude), Number(b.Longitude)]),
      dumpYard
    ]

    setDistanceText(formatDistance(totalDistance(path)))

    let i = 0

    function move() {
      if (i < path.length - 1) {

        animateMove(path[i], path[i + 1], () => {

          // ✅ SAFE CHECK (FINAL FIX)
          if (i > 0 && i <= ordered.length && ordered[i - 1]) {

            const bin = ordered[i - 1]

            updateBin({
              Bin_ID: bin.Bin_ID,
              Waste_Level: 0
            })

            setVisited(prev => [
              ...prev,
              {
                Bin_ID: String(bin.Bin_ID),
                Area: String(bin.Area || "Unknown"),
                Latitude: Number(bin.Latitude),
                Longitude: Number(bin.Longitude)
              }
            ])
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

      <button onClick={startCollection} style={{ marginBottom: "10px" }}>
        Start Collection
      </button>

      <div className="card">
        <h3>Distance: {distanceText}</h3>
      </div>

      <div className="cards">

        <div className="card">
          <h3>🧾 Collected Bins</h3>

          {visited.length === 0 && <p>No bins collected</p>}

          {visited.map((b, i) => (
            <div key={i} className="alert">
              {b.Area} ✔
            </div>
          ))}
        </div>

        <div className="card">

          <MapContainer
            center={dumpYard}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
          >

            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker position={dumpYard} icon={factoryIcon} />

            {validBins.map(b => {

              const nextBin = selected[visited.length] || null
              const isNext = nextBin && b.Bin_ID === nextBin.Bin_ID

              return (
                <Marker
                  key={b.Bin_ID}
                  position={[Number(b.Latitude), Number(b.Longitude)]}
                  icon={binIcon}
                >
                  {isNext && (
                    <CircleMarker
                      center={[Number(b.Latitude), Number(b.Longitude)]}
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
  )
}