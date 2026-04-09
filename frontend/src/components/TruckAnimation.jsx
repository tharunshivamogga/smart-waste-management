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
    if (!route || route.length === 0) return

    const interval = setInterval(() => {

      setIndex(prev => {

        // ✅ STOP BEFORE OUT OF RANGE
        if (prev >= route.length) {
          clearInterval(interval)
          return prev
        }

        const bin = route[prev]

        // ✅ SAFE CHECK (IMPORTANT)
        if (bin && bin.Bin_ID) {
          updateBin({
            Bin_ID: bin.Bin_ID,
            Waste_Level: 0
          })
        }

        // ✅ MOVE FORWARD
        if (prev < route.length - 1) {
          return prev + 1
        }

        // ✅ FINISH ROUTE (NO CRASH)
        clearInterval(interval)

        setTimeout(() => {
          reload && reload()
          setIndex(0)
        }, 2000)

        return prev
      })

    }, 1500)

    return () => clearInterval(interval)

  }, [route])

  if (!route || route.length === 0) return null

  const current = route[index]

  // ✅ FINAL SAFETY
  if (!current || !current.Latitude || !current.Longitude) return null

  return (
    <Marker
      position={[
        Number(current.Latitude),
        Number(current.Longitude)
      ]}
      icon={icon}
    />
  )
}