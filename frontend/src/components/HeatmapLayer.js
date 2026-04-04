import { CircleMarker } from "react-leaflet"

export default function HeatmapLayer({ bins }) {

  if (!bins || bins.length === 0) return null

  return (
    <>
      {bins.map(bin => {

        const lat = parseFloat(bin.Latitude)
        const lng = parseFloat(bin.Longitude)
        const waste = parseFloat(bin.Waste_Level)

        // 🔥 Safety check
        if (isNaN(lat) || isNaN(lng)) return null

        return (
          <CircleMarker
            key={bin.Bin_ID}
            center={[lat, lng]}

            // 🔥 Dynamic radius = heat intensity
            radius={Math.max(10, waste / 3)}

            pathOptions={{
              fillColor:
                waste > 80 ? "#ef4444" :     // 🔴 High
                waste > 50 ? "#facc15" :     // 🟡 Medium
                "#22c55e",                  // 🟢 Low

              fillOpacity: 0.6,
              color: "transparent"
            }}
          />
        )
      })}
    </>
  )
}