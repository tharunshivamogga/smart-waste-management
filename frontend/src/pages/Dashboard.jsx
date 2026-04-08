import { useEffect, useState } from "react"
import { getBins, getPrediction } from "../services/api"

export default function Dashboard() {

  const [bins, setBins] = useState([])
  const [pred, setPred] = useState([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const binsRes = await getBins()
      const predRes = await getPrediction()

      setBins(Array.isArray(binsRes.data) ? binsRes.data : [])

      const safePred = Array.isArray(predRes.data)
        ? predRes.data.map(p => ({
            Area: String(p?.Area || "Unknown"),
            actual: Number(p?.actual || 0),
            ai: Number(p?.ai_predicted || 0),
            ml: Number(p?.ml_predicted || 0)
          }))
        : []

      setPred(safePred)

    } catch (e) {
      console.error(e)
    }
  }

  const low = bins.filter(b => b.Waste_Level < 50).length
  const mid = bins.filter(b => b.Waste_Level >= 50 && b.Waste_Level <= 80).length
  const high = bins.filter(b => b.Waste_Level > 80).length

  return (
    <div className="page">

      <div className="card">
        <h1>🚀 Smart Waste Control Center</h1>
      </div>

      <div className="cards">
        <div className="card">
          Total Bins
          <h2>{bins.length}</h2>
        </div>

        <div className="card">
          Overflow
          <h2>{high}</h2>
        </div>
      </div>

      <h3>🚨 Alerts</h3>
      {bins.filter(b => b.Waste_Level > 80).map(b => (
        <div key={b.Bin_ID} className="alert">
          {String(b.Area)} - {Number(b.Waste_Level)}%
        </div>
      ))}

      {/* SAFE CUSTOM CHART */}
      <div className="card">
        <h3>📈 Predictions</h3>

        {pred.map((p, i) => (
          <div key={i} style={{ marginBottom: "15px" }}>
            <b>{String(p.Area)}</b>

            <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>

              <div style={{
                height: "10px",
                width: `${p.actual}%`,
                background: "#38bdf8"
              }} />

              <div style={{
                height: "10px",
                width: `${p.ai}%`,
                background: "#facc15"
              }} />

              <div style={{
                height: "10px",
                width: `${p.ml}%`,
                background: "#ef4444"
              }} />

            </div>
          </div>
        ))}
      </div>
        <pre>{JSON.stringify(pred, null, 2)}</pre>
      <div className="card">
        <h3>🧩 Waste Distribution</h3>
        <div>🟢 Low: {low}</div>
        <div>🟡 Medium: {mid}</div>
        <div>🔴 High: {high}</div>
      </div>

    </div>
  )
}