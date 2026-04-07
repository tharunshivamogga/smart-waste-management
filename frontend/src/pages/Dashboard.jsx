import { useEffect, useState } from "react"
import { getBins, getPrediction, getAnalysis } from "../services/api"

export default function Dashboard() {

  const [bins, setBins] = useState([])
  const [pred, setPred] = useState([])
  const [analysis, setAnalysis] = useState([])

  useEffect(() => {
    getBins().then(res => setBins(res.data || []))
    getPrediction().then(res => setPred(res.data || []))
    getAnalysis().then(res => setAnalysis(res.data || []))
  }, [])

  return (
    <div className="page">

      <h1>📊 Smart Dashboard</h1>

      {/* Cards */}
      <div className="cards">
        <div className="card">
          Total Bins
          <h2>{bins.length}</h2>
        </div>

        <div className="card">
          Overflow
          <h2>{bins.filter(b => b.Waste_Level > 80).length}</h2>
        </div>
      </div>

      {/* Alerts */}
      <h3>🚨 Alerts</h3>
      {bins.map(b => (
        <div key={b.Bin_ID}>
          {b.Area} - {b.Waste_Level}%
        </div>
      ))}

      {/* SAFE OUTPUT (NO CRASH) */}
      <h3>📈 Prediction Data</h3>
      <div style={{ background: "#111", padding: "10px" }}>
        {Array.isArray(pred) &&
          pred.map((p, i) => (
            <div key={i}>
              {p.Area} | {p.actual} | {p.ai_predicted} | {p.ml_predicted}
            </div>
          ))}
      </div>

      <h3>🧠 Analysis</h3>
      <div style={{ background: "#111", padding: "10px" }}>
        {Array.isArray(analysis) &&
          analysis.map((a, i) => (
            <div key={i}>
              {a.Area} | {a.usage_pattern} | {a.cluster}
            </div>
          ))}
      </div>

    </div>
  )
}