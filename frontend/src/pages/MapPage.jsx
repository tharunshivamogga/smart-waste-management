import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  CircleMarker
} from "react-leaflet"

import { useEffect, useState } from "react"
import HeatmapLayer from "../components/HeatmapLayer"

export default function MapPage(){

  const [bins,setBins] = useState([])
  const [route,setRoute] = useState([])
  const [selected,setSelected] = useState(null)
  const [progress, setProgress] = useState(1)
  const [binId,setBinId] = useState("")
  const [waste,setWaste] = useState("")

  useEffect(()=>{
    fetch("http://10.87.126.207:5000/bins")
      .then(r=>r.json())
      .then(setBins)

    fetch("http://10.87.126.207:5000/route")
      .then(r=>r.json())
      .then(setRoute)
  },[])

  useEffect(() => {
  let i = 1
  const interval = setInterval(() => {
    i++
    setProgress(i)
    if (i >= route.length) clearInterval(interval)
  }, 500)

  return () => clearInterval(interval)
}, [route])
  const coords = route.map(r=>[r.Latitude,r.Longitude])

  return(
    <div>

      {/* 🔥 Manual Bin Update */}
      <div className="card">
        <h3>Update Bin</h3>

        <input
          placeholder="Bin ID"
          onChange={e=>setBinId(e.target.value)}
        />

        <input
          placeholder="Waste %"
          onChange={e=>setWaste(e.target.value)}
        />

        <button onClick={()=>{
          fetch("http://10.87.126.207:5000/update",{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
              Bin_ID:binId,
              Waste_Level:Number(waste)
            })
          }).then(()=>window.location.reload())
        }}>
          Update
        </button>
      </div>

      {/* 🗺 MAP */}
      <MapContainer
        center={[12.97,77.59]}
        zoom={11}
        className="map"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

        {/* 🔥 HEATMAP */}
        <HeatmapLayer bins={bins} />

        {/* 📍 MARKERS */}
        {bins.map(b=>(
          <Marker
            key={b.Bin_ID}
            position={[b.Latitude,b.Longitude]}
            eventHandlers={{
              click:()=>setSelected(b)
            }}
          />
        ))}

        {/* 🔥 SELECTED BIN HIGHLIGHT */}
        {selected && (
          <CircleMarker
            center={[selected.Latitude,selected.Longitude]}
            radius={30}
            pathOptions={{color:"yellow"}}
          />
        )}

        {/* 🚛 ROUTE */}
        <Polyline
  positions={route.slice(0, progress).map(r => [r.Latitude, r.Longitude])}
  color="blue"
/>
      </MapContainer>

    </div>
  )
}