import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet"
import { useEffect, useState } from "react"
import { getAI } from "../services/api"
import L from "leaflet"

const truckIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743922.png",
  iconSize: [35, 35]
})

const dumpIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2907/2907357.png",
  iconSize: [40, 40]
})

export default function RoutePage() {

  const [routes, setRoutes] = useState({})
  const [positions, setPositions] = useState({})
  const [step, setStep] = useState(0)

  const dump = [12.90, 77.50]

  useEffect(() => {
    getAI().then(data => {
      setRoutes(data)

      // initial positions
      let init = {}
      Object.keys(data).forEach(t => {
        init[t] = data[t][0]
      })
      setPositions(init)
    })
  }, [])

  // 🚛 TRAFFIC SIMULATION (random delay)
  useEffect(() => {

    const interval = setInterval(() => {

      setPositions(prev => {
        let updated = {}

        Object.keys(routes).forEach((t, i) => {
          const route = routes[t]
          if (!route) return

          const nextIndex = (step + i) % route.length

          // simulate traffic (skip movement randomly)
          if (Math.random() < 0.2) {
            updated[t] = prev[t]
          } else {
            updated[t] = route[nextIndex]
          }
        })

        return updated
      })

      setStep(prev => prev + 1)

    }, 1500)

    return () => clearInterval(interval)

  }, [routes, step])

  return (
    <div className="page">

      <h2>🚛 AI Smart Routing + Traffic</h2>

      <MapContainer center={[12.97,77.59]} zoom={11} className="map">

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

        {/* ROUTES */}
        {Object.values(routes).map((r, i) => (
          <Polyline
            key={i}
            positions={[...r, dump]}
            color={["blue","green","orange"][i]}
          />
        ))}

        {/* TRUCKS */}
        {Object.entries(positions).map(([t, pos], i) => (
          <Marker key={t} position={pos} icon={truckIcon}/>
        ))}

        {/* DUMP */}
        <Marker position={dump} icon={dumpIcon}/>

      </MapContainer>

    </div>
  )
}