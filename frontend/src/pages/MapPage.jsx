import { MapContainer, TileLayer, CircleMarker } from "react-leaflet"
import { useEffect, useState } from "react"
import { getBins, updateBin } from "../services/api"

export default function MapPage() {

  const [bins, setBins] = useState([])
  const [binId, setBinId] = useState("")
  const [waste, setWaste] = useState("")
  const [date, setDate] = useState("") // 🔥 NEW
  const [selectedBin, setSelectedBin] = useState(null)

  function loadData() {
    getBins().then(res => setBins(res.data || []))
  }

  useEffect(() => {
    loadData()
  }, [])

  // ✅ LIMIT
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

    if (safeWaste < 0 || safeWaste > 100) {
      alert("Waste must be between 0 and 100")
      return
    }

    updateBin({
      Bin_ID: binId,
      Waste_Level: safeWaste,
      Last_Collected: date || new Date().toISOString().split("T")[0] // 🔥 USE MANUAL OR TODAY
    }).then(() => {
      loadData()
      setSelectedBin(null)
      setWaste("")
      setBinId("")
      setDate("")
    })
  }

  // 🔥 DAYS
  function getDays(date) {
    if (!date) return 999
    const today = new Date()
    const last = new Date(date)
    return Math.floor((today - last) / (1000 * 60 * 60 * 24))
  }

  // 🎨 COLOR
  function getColor(val, days) {

    if (val === 0) return "#475569"

    if (days >= 4 && val > 0) return "#ff00ff"

    if (val > 80) return "red"
    if (val > 50) return "orange"
    if (val > 30) return "yellow"

    return "green"
  }

  return (
    <div style={{ display: "flex", gap: "20px" }}>

      {/* LEFT PANEL */}
      <div style={{
        width: "300px",
        maxHeight: "500px",
        overflowY: "auto",
        background: "linear-gradient(145deg, #1e293b, #0f172a)",
        padding: "10px",
        borderRadius: "10px"
      }}>
        <h3>📋 All Bins</h3>

        {bins.map(b => {
          const days = getDays(b.Last_Collected)

          return (
            <div
              key={b.Bin_ID}
              onClick={() => {
                setBinId(b.Bin_ID)
                setWaste(b.Waste_Level)
                setDate(b.Last_Collected || "") // 🔥 LOAD DATE
                setSelectedBin(b.Bin_ID)
              }}
              style={{
                marginBottom: "10px",
                padding: "8px",
                borderRadius: "6px",
                background:
                  selectedBin === b.Bin_ID
                    ? "#0ea5e9"
                    : (days >= 4 && b.Waste_Level > 0)
                    ? "#7f1d1d"
                    : "#334155",
                cursor: "pointer"
              }}
            >
              <b>{b.Bin_ID}</b><br/>
              {b.Area}<br/>
              Waste: {b.Waste_Level}%<br/>
              🕒 {days} days ago
            </div>
          )
        })}

        <h3 style={{ marginTop: "20px" }}>🎨 Legend</h3>
        <div>⚪ Empty</div>
        <div>🟢 Low</div>
        <div>🟡 Medium</div>
        <div>🟠 High</div>
        <div>🔴 Overflow</div>
        <div>🟣 Overdue</div>
      </div>

      {/* RIGHT */}
      <div style={{ flex: 1 }}>
        <div className="card">
          <h2>🗺 Waste Monitoring</h2>

          {/* 🔥 FORM */}
          <div style={{ marginBottom: "10px" }}>
            <input
              placeholder="Bin ID"
              value={binId}
              onChange={e => setBinId(e.target.value)}
            />

            <input
              type="number"
              value={waste}
              onChange={e => handleWasteChange(e.target.value)}
              style={{ marginLeft: "10px" }}
            />

            {/* 🔥 NEW DATE INPUT */}
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{ marginLeft: "10px" }}
            />

            <button onClick={updateHandler} style={{ marginLeft: "10px" }}>
              Update
            </button>
          </div>

          {/* MAP */}
          <MapContainer
            center={[12.97, 77.59]}
            zoom={14}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

            {bins.map(b => {

              const days = getDays(b.Last_Collected)
              const isSelected = selectedBin === b.Bin_ID

              let className = ""

              if (days >= 4 && b.Waste_Level > 0) className = "blink"
              else if (b.Waste_Level > 80) className = "blink"
              else if (b.Waste_Level > 50) className = "pulse"

              return (
                <CircleMarker
                  key={b.Bin_ID}
                  center={[Number(b.Latitude), Number(b.Longitude)]}
                  radius={
                    isSelected
                      ? 22
                      : b.Waste_Level === 0
                      ? 6
                      : 10 + b.Waste_Level / 10
                  }
                  className={className}
                  pathOptions={{
                    color: isSelected ? "cyan" : getColor(b.Waste_Level, days),
                    fillColor: getColor(b.Waste_Level, days),
                    fillOpacity: 0.8,
                    weight: isSelected ? 4 : 1
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedBin(b.Bin_ID)
                      setBinId(b.Bin_ID)
                      setWaste(b.Waste_Level)
                      setDate(b.Last_Collected || "")
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