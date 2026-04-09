import { useEffect, useState } from "react"
import { getBins, getPrediction } from "../services/api"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid, BarChart, Bar
} from "recharts"

export default function Dashboard() {

  const [bins, setBins] = useState([])
  const [pred, setPred] = useState([])

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const b = await getBins()
      const p = await getPrediction()

      setBins(Array.isArray(b.data) ? b.data : [])
      setPred(Array.isArray(p.data) ? p.data : [])
    } catch (e) {
      console.error(e)
    }
  }

  // ✅ SAFE DATA + ERROR CALCULATION
  const safePred = pred.map(p => {
    const actual = Number(p.actual || 0)
    const ai = Number(p.ai_predicted || 0)
    const ml = Number(p.ml_predicted || 0)

    return {
      Area: String(p.Area || ""),
      actual,
      ai,
      ml,
      ai_error: Math.abs(actual - ai),
      ml_error: Math.abs(actual - ml)
    }
  })

  // ✅ ACCURACY CALCULATION
  const aiAccuracy = safePred.length
    ? (100 - (safePred.reduce((a, b) => a + b.ai_error, 0) / safePred.length)).toFixed(1)
    : 0

  const mlAccuracy = safePred.length
    ? (100 - (safePred.reduce((a, b) => a + b.ml_error, 0) / safePred.length)).toFixed(1)
    : 0

  const low = bins.filter(b => b.Waste_Level < 50).length
  const medium = bins.filter(b => b.Waste_Level >= 50 && b.Waste_Level <= 80).length
  const high = bins.filter(b => b.Waste_Level > 80).length

  const pieData = [
    { name: "Low", value: low },
    { name: "Medium", value: medium },
    { name: "High", value: high }
  ]

  const COLORS = ["#22c55e", "#facc15", "#ef4444"]

  return (
    <div className="page">

      {/* 🚀 HEADER */}
      <div className="card" style={{
        background: "linear-gradient(135deg, #0ea5e9, #22c55e)",
        color: "white"
      }}>
        <h1>🚀 Smart Waste Dashboard</h1>
        <p>AI + ML powered waste monitoring system</p>
      </div>

      {/* 📊 KPI CARDS */}
      <div className="cards">
        <div className="card">
          <h3>Total Bins</h3>
          <h2>{bins.length}</h2>
        </div>

        <div className="card">
          <h3>Overflow</h3>
          <h2>{high}</h2>
        </div>

        <div className="card">
          <h3>AI Accuracy</h3>
          <h2 style={{ color: "#facc15" }}>{aiAccuracy}%</h2>
        </div>

        <div className="card">
          <h3>ML Accuracy</h3>
          <h2 style={{ color: "#ef4444" }}>{mlAccuracy}%</h2>
        </div>
      </div>

      {/* 📈 AI vs ACTUAL */}
      <div className="card">
        <h3>📈 AI Prediction vs Actual</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={safePred}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Area" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#38bdf8" strokeWidth={3} />
            <Line type="monotone" dataKey="ai" stroke="#facc15" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 ML vs ACTUAL */}
      <div className="card">
        <h3>📊 ML Prediction vs Actual</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={safePred}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Area" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#38bdf8" strokeWidth={3} />
            <Line type="monotone" dataKey="ml" stroke="#ef4444" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 📉 ERROR GRAPH */}
      <div className="card">
        <h3>📉 Prediction Error (Lower = Better)</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={safePred}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Area" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ai_error" fill="#facc15" />
            <Bar dataKey="ml_error" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🧩 PIE */}
      <div className="card">
        <h3>🧩 Waste Distribution</h3>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" outerRadius={100} label>
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 🚨 ALERTS */}
      <div className="card">
        <h3>🚨 Overflow Alerts</h3>

        {bins.filter(b => b.Waste_Level > 80).length === 0 && (
          <p>No alerts</p>
        )}

        {bins.filter(b => b.Waste_Level > 80).map(b => (
          <div key={b.Bin_ID} className="alert">
            {b.Area} - {b.Waste_Level}%
          </div>
        ))}
      </div>

    </div>
  )
}