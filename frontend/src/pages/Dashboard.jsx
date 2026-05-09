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

  const [aiAcc, setAiAcc] = useState(0)
  const [mlAcc, setMlAcc] = useState(0)
  const [aiRmse, setAiRmse] = useState(0)
  const [mlRmse, setMlRmse] = useState(0)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const b = await getBins()
      const p = await getPrediction()

      setBins(Array.isArray(b.data) ? b.data : [])
      setPred(Array.isArray(p.data) ? p.data : [])

      setAiAcc(Number(p.ai_accuracy || 0))
      setMlAcc(Number(p.ml_accuracy || 0))
      setAiRmse(Number(p.ai_rmse || 0))
      setMlRmse(Number(p.ml_rmse || 0))

    } catch (e) {
      console.error(e)
    }
  }

  // ✅ SAFE PRED DATA
  const safePred = pred.map((p, i) => {
    const actual = Number(p.actual || 0)
    const ai = Number(p.ai_predicted || 0)
    const ml = Number(p.ml_predicted || 0)

    return {
      Area: p.Area || `Area-${i}`,
      actual,
      ai,
      ml,
      ai_error: Math.abs(actual - ai),
      ml_error: Math.abs(actual - ml)
    }
  })

  // ✅ KPI
  const totalBins = bins.length

  const overflow = bins.filter(b => b.Waste_Level > 80).length

  const avgWaste = bins.length
    ? (bins.reduce((a, b) => a + b.Waste_Level, 0) / bins.length).toFixed(1)
    : 0

// 🔥 OVERDUE LOGIC (FIXED - DO NOT BREAK ANYTHING)
const overdue = bins.filter(b => {

  // ❌ ignore empty bins
  if (Number(b.Waste_Level) === 0) return false

  // ❌ ignore if no date
  if (!b.Last_Collected) return false

  const days = Math.floor(
    (new Date() - new Date(b.Last_Collected)) / (1000*60*60*24)
  )

  return days >= 4

}).length
  // ✅ FALLBACK ACCURACY (if backend fails)
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

  return (
    <div className="page">

      {/* HEADER */}
      <div className="card">
        <h1>🚀 Smart Waste Control Center</h1>
        <p style={{ color: "#94a3b8" }}>
          AI + ML powered analytics dashboard
        </p>
      </div>

      {/* KPI CARDS */}
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
          <h3>⏰ Overdue</h3>
          <h2 style={{ color: "#f43f5e" }}>{overdue}</h2>
        </div>

        <div className="card">
          <h3>AI Accuracy</h3>
          <h2>{aiAcc ? aiAcc.toFixed(2) : aiAccuracy}%</h2>
        </div>

        <div className="card">
          <h3>ML Accuracy</h3>
          <h2>{mlAcc ? mlAcc.toFixed(2) : mlAccuracy}%</h2>
        </div>

      </div>

      {/* ALERTS */}
      <div className="card">
        <h3>🚨 Overflow Alerts</h3>

        {overflow === 0 && <p>No alerts</p>}

        {bins.filter(b => b.Waste_Level > 80).map(b => (
          <div key={b.Bin_ID} className="alert">
            {b.Area} - {b.Waste_Level}%
          </div>
        ))}
      </div>

      {/* RMSE */}
      <div className="card">
        <h3>📉 RMSE Comparison</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              { name: "AI", value: aiRmse },
              { name: "ML", value: mlRmse }
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />

            <Tooltip />

            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
              <Cell fill="#facc15" />
              <Cell fill="#38bdf8" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI CHART */}
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

      {/* ML CHART */}
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

      {/* ERROR GRAPH */}
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

      {/* PIE CHART */}
      <div className="card">
        <h3>🧩 Waste Distribution</h3>

        <ResponsiveContainer width="100%" height={320}>
          <PieChart>

            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              innerRadius={50}
              paddingAngle={5}
              animationDuration={1000}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              <Cell fill="#22c55e" />
              <Cell fill="#facc15" />
              <Cell fill="#ef4444" />
            </Pie>

            <Tooltip />
            <Legend />

          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}