import { MapContainer, TileLayer, CircleMarker } from "react-leaflet"
import { useEffect, useState } from "react"
import { getBins, updateBin } from "../services/api"

export default function MapPage() {

  const [bins, setBins] = useState([])
  const [binId, setBinId] = useState("")
  const [waste, setWaste] = useState("")
  const [selectedBin, setSelectedBin] = useState(null)

  function loadData() {
    getBins().then(res => setBins(res.data || []))
  }

  useEffect(() => {
    loadData()
  }, [])

  // ✅ HANDLE INPUT (LIMIT 0–100)
  function handleWasteChange(val) {
    let num = Number(val)

    if (isNaN(num)) num = 0
    if (num < 0) num = 0
    if (num > 100) num = 100

    setWaste(num)
  }

  function updateHandler() {
    if (!binId || waste === "") {
      alert("Enter values")
      return
    }

    const safeWaste = Number(waste)

    // ✅ FINAL CHECK
    if (safeWaste < 0 || safeWaste > 100) {
      alert("Waste must be between 0 and 100")
      return
    }

    updateBin({
      Bin_ID: binId,
      Waste_Level: safeWaste
    }).then(() => {
      loadData()
      setSelectedBin(null)
      setWaste("")
      setBinId("")
    })
  }

  // 🎨 COLOR LOGIC
  function getColor(val) {
    if (val > 80) return "red"
    if (val > 50) return "orange"
    if (val > 30) return "yellow"
    return "green"
  }

  return (
    <div style={{ display: "flex", gap: "20px" }}>

      {/* 🔥 LEFT PANEL */}
      <div style={{
        width: "300px",
        maxHeight: "500px",
        overflowY: "auto",
        background: "linear-gradient(145deg, #1e293b, #0f172a)",
        boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
        padding: "10px",
        borderRadius: "10px"
      }}>
        <h3>📋 All Bins</h3>

        {bins.map(b => (
          <div
            key={b.Bin_ID}
            onClick={() => {
              setBinId(b.Bin_ID)
              setWaste(b.Waste_Level)
              setSelectedBin(b.Bin_ID)
            }}
            style={{
              marginBottom: "10px",
              padding: "8px",
              borderRadius: "6px",
              background: selectedBin === b.Bin_ID ? "#475569" : "#334155",
              cursor: "pointer"
            }}
          >
            <b>{b.Bin_ID}</b><br/>
            {b.Area}<br/>
            Waste: {b.Waste_Level}%
          </div>
        ))}

        {/* 🎨 LEGEND */}
        <h3 style={{ marginTop: "20px" }}>🎨 Legend</h3>
        <div>🟢 Low (&lt;30%)</div>
        <div>🟡 Medium (30–50%)</div>
        <div>🟠 High (50–80%)</div>
        <div>🔴 Overflow (&gt;80%)</div>
      </div>

      {/* 🔥 RIGHT SIDE */}
      <div style={{ flex: 1 }}>
        <div className="card">
          <h2>🗺 Waste Monitoring</h2>

          {/* 🔧 UPDATE FORM */}
          <div style={{ marginBottom: "10px" }}>
            <input
              placeholder="Bin ID"
              value={binId}
              onChange={e => setBinId(e.target.value)}
            />

            <input
              type="number"
              min="0"
              max="100"
              placeholder="Waste % (0–100)"
              value={waste}
              onChange={e => handleWasteChange(e.target.value)}
              style={{ marginLeft: "10px" }}
            />

            <button onClick={updateHandler} style={{ marginLeft: "10px" }}>
              Update
            </button>
          </div>

          {/* 🗺 MAP */}
          <MapContainer
            center={[12.97, 77.59]}
            zoom={14}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

            {bins.map(b => {
              const isSelected = selectedBin === b.Bin_ID

              let className = ""
              if (b.Waste_Level > 80) className = "blink"
              else if (b.Waste_Level > 50) className = "pulse"

              return (
                <CircleMarker
                  key={b.Bin_ID}
                  center={[Number(b.Latitude), Number(b.Longitude)]}
                  radius={isSelected ? 22 : 10 + b.Waste_Level / 10}
                  className={className}
                  pathOptions={{
                    color: isSelected ? "cyan" : getColor(b.Waste_Level),
                    fillColor: getColor(b.Waste_Level),
                    fillOpacity: 0.7,
                    weight: isSelected ? 4 : 1
                  }}
                  eventHandlers={{
                    click: () => {
                      setBinId(b.Bin_ID)
                      setWaste(b.Waste_Level)
                      setSelectedBin(b.Bin_ID)
                    }
                  }}
                />
              )
            })}

          </MapContainer>
        </div>
      </div>
    </div>
  )
}