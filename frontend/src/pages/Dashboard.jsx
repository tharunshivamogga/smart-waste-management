import { useEffect, useState } from "react"
import { getBins, getPrediction } from "../services/api"
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
  BarChart, Bar, PieChart, Pie, Cell
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

      setBins(b.data || [])
      setPred(p.data || [])
    } catch (e) {
      console.error(e)
    }
  }

  // ✅ SAFE DATA
  const safePred = (pred || []).map((p, i) => {
    const actual = Number(p.actual) || 0
    const ai = Number(p.ai_predicted) || 0
    const ml = Number(p.ml_predicted) || 0

    return {
      Area: p.Area || `Area-${i}`,
      actual,
      ai,
      ml,
      ai_error: Math.abs(actual - ai),
      ml_error: Math.abs(actual - ml)
    }
  })

  // ✅ KPI CALCULATIONS
  const totalBins = bins.length
  const overflow = bins.filter(b => b.Waste_Level > 80).length
  const avgWaste = bins.length
    ? (bins.reduce((a, b) => a + b.Waste_Level, 0) / bins.length).toFixed(1)
    : 0

  const aiAccuracy = safePred.length
    ? (100 - (safePred.reduce((a, b) => a + b.ai_error, 0) / safePred.length)).toFixed(1)
    : 0

  const mlAccuracy = safePred.length
    ? (100 - (safePred.reduce((a, b) => a + b.ml_error, 0) / safePred.length)).toFixed(1)
    : 0

  // ✅ PIE DATA
  const low = bins.filter(b => b.Waste_Level < 50).length
  const mid = bins.filter(b => b.Waste_Level >= 50 && b.Waste_Level <= 80).length
  const high = bins.filter(b => b.Waste_Level > 80).length

  const pieData = [
    { name: "Low", value: low },
    { name: "Medium", value: mid },
    { name: "High", value: high }
  ]

  const COLORS = ["#22c55e", "#facc15", "#ef4444"]

  return (
    <div className="page">

      {/* 🚀 HEADER */}
      <div className="card">
        <h1>🚀 Smart Waste Control Center</h1>
        <p style={{ color: "#94a3b8" }}>
          AI + ML powered analytics dashboard
        </p>
      </div>

      {/* 📊 KPI CARDS */}
      <div className="cards">
        <div className="card">
          <h3>Total Bins</h3>
          <h2>{totalBins}</h2>
        </div>

        <div className="card">
          <h3>Overflow</h3>
          <h2>{overflow}</h2>
        </div>

        <div className="card">
          <h3>Avg Waste</h3>
          <h2>{avgWaste}%</h2>
        </div>

        <div className="card">
          <h3>AI Accuracy</h3>
          <h2>{aiAccuracy}%</h2>
        </div>

        <div className="card">
          <h3>ML Accuracy</h3>
          <h2>{mlAccuracy}%</h2>
        </div>
      </div>

      {/* 🚨 ALERTS */}
      <div className="card">
        <h3>🚨 Overflow Alerts</h3>

        {overflow === 0 && <p>No alerts</p>}

        {bins.filter(b => b.Waste_Level > 80).map(b => (
          <div key={b.Bin_ID} className="alert">
            {b.Area} - {b.Waste_Level}%
          </div>
        ))}
      </div>

      {/* 📈 AI CHART */}
      <div className="card">
        <h3>📈 AI vs Actual</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={safePred}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Area" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line dataKey="actual" stroke="#38bdf8" strokeWidth={3} />
            <Line dataKey="ai" stroke="#facc15" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 ML CHART */}
      <div className="card">
        <h3>📊 ML vs Actual</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={safePred}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Area" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line dataKey="actual" stroke="#38bdf8" strokeWidth={3} />
            <Line dataKey="ml" stroke="#ef4444" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 📉 ERROR GRAPH */}
      <div className="card">
        <h3>📉 Error Comparison</h3>
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
            <Pie data={pieData} dataKey="value" outerRadius={100}>
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}