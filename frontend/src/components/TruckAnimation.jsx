import { Marker } from "react-leaflet"
import { useEffect, useState } from "react"
import L from "leaflet"
import { updateBin } from "../services/api"

const icon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743922.png",
  iconSize: [40, 40]
})

export default function TruckAnimation({ route, reload }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!route.length) return

    const interval = setInterval(() => {
      setIndex(prev => {
        if (prev < route.length - 1) {

          // 🔥 EMPTY BIN AFTER VISIT
          const bin = route[prev]
          updateBin({
            Bin_ID: bin.Bin_ID,
            Waste_Level: 0
          })

          return prev + 1
        }

        // 🔥 WAIT 1 MIN THEN RESTART
        setTimeout(() => {
          reload()
          setIndex(0)
        }, 60000)

        clearInterval(interval)
        return prev
      })
    }, 1500)

    return () => clearInterval(interval)

  }, [route])

  if (!route.length) return null

  return (
    <Marker
      position={[
        route[index].Latitude,
        route[index].Longitude
      ]}
      icon={icon}
    />
  )
}