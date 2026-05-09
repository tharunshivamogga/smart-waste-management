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

const truckIcon = L.divIcon({
  html: "🚛",
  className: "truck-icon",
  iconSize: [40, 40]
})

const factoryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2906/2906274.png",
  iconSize: [40, 40]
})

const binIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484662.png",
  iconSize: [30, 30]
})

export default function RoutePage() {

  const [bins, setBins] = useState([])

  const [truck1Pos, setTruck1Pos] = useState(null)
  const [path1, setPath1] = useState([])

  const [truck2Pos, setTruck2Pos] = useState(null)
  const [path2, setPath2] = useState([])

  const [visited, setVisited] = useState([])
  const [selectedBin, setSelectedBin] = useState(null)

  const role = localStorage.getItem("role")
  const dumpYard = [12.9716, 77.5946]

  useEffect(() => {
    load()
  }, [])

  function load() {
    getBins().then(res => setBins(res.data || []))
  }

  const validBins = bins.filter(
    b => b && !isNaN(Number(b.Latitude)) && !isNaN(Number(b.Longitude))
  )

  function distance(a, b) {
    return Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2)
  }

  function optimizeRoute(binList) {
    let remaining = [...binList]
    let current = dumpYard
    let ordered = []

    while (remaining.length) {
      let nearest = remaining.reduce((prev, curr) =>
        distance(current, [curr.Latitude, curr.Longitude]) <
        distance(current, [prev.Latitude, prev.Longitude]) ? curr : prev
      )

      ordered.push(nearest)
      current = [nearest.Latitude, nearest.Longitude]
      remaining = remaining.filter(b => b !== nearest)
    }

    return ordered
  }

  function animateMove(start, end, setTruck, setPath) {
    return new Promise(resolve => {
      let step = 0
      const steps = 40

      const interval = setInterval(() => {
        step++

        const lat = start[0] + (end[0]-start[0])*(step/steps)
        const lng = start[1] + (end[1]-start[1])*(step/steps)

        setTruck([lat, lng])
        setPath(prev => [...prev, [lat, lng]])

        if (step >= steps) {
          clearInterval(interval)
          resolve()
        }
      }, 40)
    })
  }

  function startCollection(type = "overflow") {

    // ✅ FIXED DATE (CRITICAL)
    const today = new Date()
    const todayStr = today.toISOString().split("T")[0]

    function daysDiff(dateStr) {
      if (!dateStr) return 999
      const past = new Date(dateStr)
      return Math.floor(
        (today.getTime() - past.getTime()) / (1000 * 60 * 60 * 24)
      )
    }

    let filtered = []

    // ✅ OVERFLOW LOGIC
    if (type === "overflow") {
      filtered = validBins.filter(b => Number(b.Waste_Level) >= 50)
    }

    // ✅ OVERDUE LOGIC (FIXED)
    if (type === "overdue") {
      filtered = validBins.filter(b =>
        Number(b.Waste_Level) > 0 &&
        daysDiff(b.Last_Collected) >= 4
      )
    }

    if (filtered.length === 0) {
      alert("No bins to collect")
      return
    }

    const ordered = optimizeRoute(filtered.slice(0, 7))

    const path = [
      dumpYard,
      ...ordered.map(b => [Number(b.Latitude), Number(b.Longitude)]),
      dumpYard
    ]

    async function move() {

      for (let i = 0; i < path.length - 1; i++) {

        if (type === "overflow") {
          await animateMove(path[i], path[i + 1], setTruck1Pos, setPath1)
        } else {
          await animateMove(path[i], path[i + 1], setTruck2Pos, setPath2)
        }

        const bin =
          i > 0 && i - 1 < ordered.length
            ? ordered[i - 1]
            : null

        if (bin && bin.Bin_ID) {

          // ✅ FINAL FIX → THIS WAS YOUR BUG
          await updateBin({
            Bin_ID: String(bin.Bin_ID),
            Waste_Level: 0,
            Last_Collected: todayStr   // ✅ FIXED
          })

          setVisited(prev => [
            ...prev,
            {
              Area: String(bin.Area || "Unknown"),
              Bin_ID: bin.Bin_ID,
              type: type
            }
          ])
        }
      }

      load() // refresh
    }

    move()
  }

  return (
    <div className="page">

      <h1>🚛 Smart Route Dashboard</h1>

      <h3>
        {role === "admin" && "👨‍💼 Admin"}
        {role === "driver" && "🚛 Driver 1 (Overflow)"}
        {role === "driver2" && "🚛 Driver 2 (Overdue)"}
      </h3>

      {/* ADMIN */}
      {role === "admin" && (
        <>
          <button onClick={() => startCollection("overflow")}>
            🚛 Overflow
          </button>

          <button
            onClick={() => startCollection("overdue")}
            style={{ marginLeft: 10, background: "purple", color: "white" }}
          >
            🚛 Overdue
          </button>
        </>
      )}

      {/* DRIVER 1 */}
      {role === "driver" && (
        <button onClick={() => startCollection("overflow")}>
          🚛 Overflow
        </button>
      )}

      {/* DRIVER 2 */}
      {role === "driver2" && (
        <button
          onClick={() => startCollection("overdue")}
          style={{ background: "purple", color: "white" }}
        >
          🚛 Overdue
        </button>
      )}

      <div className="cards">

        <div className="card">
          <h3>🧾 Collected Bins</h3>

          {visited.length === 0 && <p>No bins collected</p>}

          {visited.map((b, i) => (
            <div
              key={i}
              style={{
                background: b.type === "overflow" ? "#1d4ed8" : "#7c3aed",
                color: "white",
                padding: "6px",
                borderRadius: "6px",
                marginBottom: "5px"
              }}
            >
              {b.Area} ({b.Bin_ID}) ✔
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

            {validBins.map((b, idx) => {

              if (!b || !b.Bin_ID) return null

              const isSelected = selectedBin === b.Bin_ID

              return (
                <>
                  <Marker
                    key={b.Bin_ID || idx}
                    position={[Number(b.Latitude), Number(b.Longitude)]}
                    icon={binIcon}
                    eventHandlers={{
                      click: () => setSelectedBin(b.Bin_ID)
                    }}
                  />

                  {isSelected && (
                    <CircleMarker
                      center={[Number(b.Latitude), Number(b.Longitude)]}
                      radius={25}
                      pathOptions={{
                        color: "cyan",
                        weight: 3
                      }}
                    />
                  )}
                </>
              )
            })}

            <Polyline positions={path1} color="blue" />
            <Polyline positions={path2} color="purple" />

            {truck1Pos && <Marker position={truck1Pos} icon={truckIcon} />}
            {truck2Pos && <Marker position={truck2Pos} icon={truckIcon} />}

          </MapContainer>

        </div>

      </div>

    </div>
  )
}