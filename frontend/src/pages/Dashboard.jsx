import { useEffect, useState } from "react"
import { getBins, getPrediction } from "../services/api"
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell
} from "recharts"

export default function Dashboard() {

  const [bins, setBins] = useState([])
  const [pred, setPred] = useState([])

  useEffect(() => {
    load()
  }, [])

  function load() {
    getBins().then(res => setBins(res.data || []))
    getPrediction().then(res => setPred(res.data || []))
  }

  // ✅ SAFE DATA (IMPORTANT)
  const safePred = Array.isArray(pred)
    ? pred.filter(p =>
        p &&
        typeof p.Area === "string" &&
        !isNaN(p.actual) &&
        !isNaN(p.ai_predicted) &&
        !isNaN(p.ml_predicted)
      )
    : []

  const pieData = [
    { name: "Low", value: bins.filter(b => b.Waste_Level < 50).length },
    { name: "Medium", value: bins.filter(b => b.Waste_Level >= 50 && b.Waste_Level <= 80).length },
    { name: "High", value: bins.filter(b => b.Waste_Level > 80).length }
  ]

  return (
    <div className="page">

     <div className="card" style={{
  marginBottom: "20px",
  background: "linear-gradient(135deg, rgba(56,189,248,0.15), rgba(34,197,94,0.1))"
}}>
  <h1>🚀 Smart Waste Control Center</h1>
  <p style={{ color: "#94a3b8" }}>
    Real-time monitoring, prediction, and optimization of waste collection
  </p>
</div>

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
      {bins.filter(b => b.Waste_Level > 80).map(b => (
        <div key={b.Bin_ID} className="alert">
          {b.Area} - {b.Waste_Level}%
        </div>
      ))}

      {/* 🔥 AI PREDICTION */}
     <div className="card">
  <h3>📈 AI Prediction</h3>
      {safePred.length > 0 ? (
        <LineChart width={700} height={300} data={safePred}>
          <XAxis dataKey="Area" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="actual" stroke="#38bdf8" />
          <Line type="monotone" dataKey="ai_predicted" stroke="#facc15" />
        </LineChart>
      ) : (
        <p>Loading AI Prediction...</p>
      )}

      {/* 🔥 ML PREDICTION */}
      <h3>📊 ML Prediction</h3>
      {safePred.length > 0 ? (
        <LineChart width={700} height={300} data={safePred}>
          <XAxis dataKey="Area" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="actual" stroke="#38bdf8" />
          <Line type="monotone" dataKey="ml_predicted" stroke="#ef4444" />
        </LineChart>
      ) : (
        <p>Loading ML Prediction...</p>
      )}

      {/* Pie */}
      <h3>🧩 Waste Distribution</h3>
      <PieChart width={300} height={300}>
        <Pie data={pieData} dataKey="value" outerRadius={100} label>
          {pieData.map((_, i) => (
            <Cell key={i} fill={["#22c55e", "#facc15", "#ef4444"][i]} />
          ))}
        </Pie>
      </PieChart>
    </div>
    </div>
  )
}