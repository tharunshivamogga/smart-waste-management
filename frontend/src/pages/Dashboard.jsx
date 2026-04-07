import { useEffect, useState } from "react"
import { getBins, getPrediction, getAnalysis } from "../services/api"
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell
} from "recharts"

export default function Dashboard() {

  const [bins, setBins] = useState([])
  const [pred, setPred] = useState([])
  const [analysis, setAnalysis] = useState([])

  useEffect(() => {
    load()
  }, [])

  function load() {
    getBins().then(res => setBins(res.data || []))
    getPrediction().then(res => setPred(res.data || []))
    getAnalysis().then(res => setAnalysis(res.data || []))
  }

  function notify(msg) {
    if (Notification.permission === "granted") {
      new Notification(msg)
    } else {
      Notification.requestPermission()
    }
  }

  const pieData = [
    { name: "Low", value: bins.filter(b => b.Waste_Level < 50).length },
    { name: "Medium", value: bins.filter(b => b.Waste_Level >= 50 && b.Waste_Level <= 80).length },
    { name: "High", value: bins.filter(b => b.Waste_Level > 80).length }
  ]
 const safePred = Array.isArray(pred)
  ? pred
      .filter(p =>
        p &&
        typeof p === "object" &&
        typeof p.Area === "string" &&
        typeof p.actual === "number" &&
        typeof p.ai_predicted === "number" &&
        typeof p.ml_predicted === "number"
      )
  : []
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
      {bins.filter(b => b.Waste_Level > 80).map(b => (
        <div key={b.Bin_ID} className="alert">
          {b.Area} - {b.Waste_Level}%
        </div>
      ))}

      {/* 🧠 Bin Analysis (FIXED POSITION) */}
      <h3>🧠 Bin Analysis</h3>
     {Array.isArray(analysis) && analysis.map(b => (
        <div key={b.Bin_ID} className="alert">
          {b.Area} | {b.usage_pattern} | {b.cluster}
        </div>
      ))}

      {/* AI Prediction */}
      
      <h3>📈 AI Prediction</h3>
 {safePred.length > 0 ? (
  <LineChart width={700} height={300} data={safePred}>
    <XAxis dataKey="Area" />
    <YAxis />
    <Tooltip formatter={(value) => Number(value).toFixed(1)} />
    <Line type="monotone" dataKey="actual" stroke="#38bdf8" />
    <Line type="monotone" dataKey="ai_predicted" stroke="#facc15" />
  </LineChart>
) : (
  <p>Loading...</p>
)}
   {safePred.length > 0 ? (
  <LineChart width={700} height={300} data={safePred}>
    <XAxis dataKey="Area" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="actual" stroke="#38bdf8" />
    <Line type="monotone" dataKey="ml_predicted" stroke="#ef4444" />
  </LineChart>
) : (
  <p>Loading...</p>
)}

      {/* Pie Chart */}
      <h3>🧩 Waste Distribution</h3>
      <PieChart width={300} height={300}>
        <Pie data={pieData} dataKey="value" outerRadius={100} label>
          {pieData.map((_, i) => (
            <Cell key={i} fill={["#22c55e", "#facc15", "#ef4444"][i]} />
          ))}
        </Pie>
      </PieChart>

    </div>
  )
}