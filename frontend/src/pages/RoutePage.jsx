import { MapContainer, TileLayer, Marker, Polyline, CircleMarker } from "react-leaflet"
import { useEffect, useState } from "react"
import { getBins, updateBin } from "../services/api"
import L from "leaflet"

// 🚛 REAL TRUCK ICON
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
  const [route, setRoute] = useState([])
  const [truckPos, setTruckPos] = useState(null)
  const [visited, setVisited] = useState([])
  const [pathLine, setPathLine] = useState([])

  const dumpYard = [12.9716, 77.5946]

  const binIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484662.png",
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  })

  function load() {
    getBins().then(res => setBins(res.data || []))
  }

  useEffect(() => {
    load()
  }, [])

  // 🔥 distance
  function dist(a, b) {
    return Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2)
  }

  // 🔥 optimized route
  function optimize(bins) {
    let rem = [...bins]
    let current = dumpYard
    let result = []

    while (rem.length) {
      let nearest = rem.reduce((prev, curr) =>
        dist(current, [curr.Latitude, curr.Longitude]) <
        dist(current, [prev.Latitude, prev.Longitude]) ? curr : prev
      )
      result.push(nearest)
      current = [nearest.Latitude, nearest.Longitude]
      rem = rem.filter(b => b !== nearest)
    }

    return result
  }

  function startCollection() {

    const selected = optimize(
      [...bins].sort((a,b)=>b.Waste_Level-a.Waste_Level).slice(0,7)
    )

    setRoute(selected)
    setVisited([])
    setPathLine([])

    const path = [
      dumpYard,
      ...selected.map(b => [Number(b.Latitude), Number(b.Longitude)]),
      dumpYard
    ]

    let i = 0

    function animate(start, end, callback) {
      let step = 0
      const steps = 40

      const interval = setInterval(() => {
        step++

        const lat = start[0] + (end[0]-start[0])*(step/steps)
        const lng = start[1] + (end[1]-start[1])*(step/steps)

        setTruckPos([lat,lng])

        // 🔥 animated route line
        setPathLine(prev => [...prev, [lat,lng]])

        if(step >= steps){
          clearInterval(interval)
          callback()
        }
      }, 40)
    }

    function move() {
      if(i < path.length-1){

        animate(path[i], path[i+1], () => {

          if(i>0 && i<=selected.length){
            const bin = selected[i-1]

            updateBin({
              Bin_ID: bin.Bin_ID,
              Waste_Level: 0
            })

            setVisited(prev => [...prev, bin])
          }

          i++
          move()
        })

      } else {
        load()
      }
    }

    setTruckPos(dumpYard)
    move()
  }

  return (
    <div style={{ display:"flex", gap:"20px" }}>

      {/* 📋 VISITED */}
      <div style={{
        width:"300px",
        background:"#1e293b",
        padding:"10px",
        borderRadius:"10px",
        maxHeight:"500px",
        overflowY:"auto"
      }}>
        <h3>🧾 Collected Bins</h3>

        {visited.map(b => (
          <div key={b.Bin_ID} style={{
            marginBottom:"10px",
            background:"#334155",
            padding:"8px",
            borderRadius:"6px"
          }}>
            {b.Area} ✔
          </div>
        ))}
      </div>

      {/* 🗺 MAP */}
      <div style={{ flex:1 }}>

        <h2>🚛 Smart Route System</h2>

        <button onClick={startCollection}>
          Start Collection
        </button>

        <MapContainer center={dumpYard} zoom={13}
          style={{ height:"500px", width:"100%" }}>

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

          {/* 🏭 Dumpyard */}
          <Marker position={dumpYard} icon={factoryIcon} />

{/* 🔥 Bins */}
{bins.map(b => (
          <Marker
             key={b.Bin_ID}
              position={[b.Latitude, b.Longitude]}
               icon={binIcon}
          />
        ))}

          {/* 🔥 Animated Path */}
          <Polyline positions={pathLine} color="blue" />

          {/* 🚛 Truck */}
          {truckPos && (
            <Marker position={truckPos} icon={truckIcon} />
          )}

        </MapContainer>

      </div>

    </div>
  )
}