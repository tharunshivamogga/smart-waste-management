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

      const safeBins = Array.isArray(binsRes.data) ? binsRes.data : []

      const safePred = Array.isArray(predRes.data)
        ? predRes.data.map(p => ({
            Area: String(p?.Area || "Unknown"),
            actual: Number(p?.actual || 0),
            ai: Number(p?.ai_predicted || 0),
            ml: Number(p?.ml_predicted || 0)
          }))
        : []

      setBins(safeBins)
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

      {/* Stats */}
      <div className="cards">
        <div className="card">
          <h3>Total Bins</h3>
          <h2>{bins.length}</h2>
        </div>

        <div className="card">
          <h3>Overflow</h3>
          <h2>{high}</h2>
        </div>
      </div>

      {/* Alerts */}
      <h3>🚨 Alerts</h3>
      {bins.filter(b => b.Waste_Level > 80).map(b => (
        <div key={b.Bin_ID} className="alert">
          {String(b.Area)} - {Number(b.Waste_Level)}%
        </div>
      ))}

      {/* 🔥 SAFE RENDER ONLY */}
      <div className="card">
        <h3>📈 Predictions</h3>

        {pred.length === 0 && <p>No data</p>}

        {pred.map((p, i) => (
          <div key={i}>
            <p>
              <b>{String(p.Area)}</b>
            </p>

            <p>Actual: {p.actual}</p>
            <p>AI: {p.ai}</p>
            <p>ML: {p.ml}</p>

            <hr />
          </div>
        ))}
      </div>

    </div>
  )
}