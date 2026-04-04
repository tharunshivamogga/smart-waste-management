import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet"
import { useEffect, useState } from "react"

export default function RoutePage(){

  const [route,setRoute] = useState([])
  const [index,setIndex] = useState(0)

  useEffect(()=>{
    fetch("http://10.87.126.207:5000/route")
      .then(r=>r.json())
      .then(setRoute)
  },[])

  const coords = route.map(r=>[r.Latitude,r.Longitude])

  useEffect(()=>{
    const i = setInterval(()=>{
      setIndex(prev=>(prev+1)%coords.length)
    },1000)
    return ()=>clearInterval(i)
  },[coords])

  return(
    <div>

      <h2>🚛 Truck Route</h2>

      <MapContainer center={[12.97,77.59]} zoom={11} className="map">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

        <Polyline positions={coords} color="blue"/>

        {coords.length>0 && (
          <Marker position={coords[index]}/>
        )}

      </MapContainer>

    </div>
  )
}