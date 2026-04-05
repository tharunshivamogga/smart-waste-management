import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet"
import { useEffect, useState } from "react"
import { getBins, getRoute } from "../services/api"

export default function MapPage(){

  const [bins,setBins] = useState([])
  const [route,setRoute] = useState([])

  useEffect(()=>{
    getBins().then(setBins)
    getRoute().then(setRoute)
  },[])

  const coords = route.map(r=>[r.Latitude,r.Longitude])

  return(
    <div className="page">

      <h2>🗺️ Waste Map</h2>

      <MapContainer center={[12.97,77.59]} zoom={11} className="map">

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

        {bins.map(b=>(
          <Marker key={b.Bin_ID} position={[b.Latitude,b.Longitude]}/>
        ))}

        <Polyline positions={coords} color="blue"/>

      </MapContainer>

    </div>
  )
}