import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts"
import { LineChart, Line } from "recharts"
export default function Dashboard(){

  const [bins,setBins] = useState([])

  useEffect(()=>{
    fetch("http://10.87.126.207:5000/bins")
      .then(res=>res.json())
      .then(data=>setBins(data))
  },[])

  const overflow = bins.filter(b=>b.Waste_Level>80)

  // ✅ FIXED PIE DATA
  const pieData = [
    { name: "Low", value: bins.filter(b => b.Waste_Level < 50).length },
    { name: "Medium", value: bins.filter(b => b.Waste_Level >= 50 && b.Waste_Level < 80).length },
    { name: "High", value: bins.filter(b => b.Waste_Level >= 80).length }
  ]
  const predictionData = bins.map((b, i) => ({
  name: b.Area,
  current: b.Waste_Level,
  predicted: Math.min(100, b.Waste_Level + Math.floor(Math.random() * 20))
}))
  return(
    <div>

      <h1>📊 Dashboard</h1>

      {/* Cards */}
      <div className="cards">
  <div className="card">
    <h3>Total Bins</h3>
    <h1>{bins.length}</h1>
  </div>

  <div className="card">
    <h3>Overflow</h3>
    <h1>{overflow.length}</h1>
  </div>

  <div className="card">
    <h3>Efficiency</h3>
    <h1>{100 - overflow.length * 5}%</h1>
  </div>
</div>

      {/* Alerts */}
     <h3>🔔 Notifications</h3>

{overflow.map(b => (
  <div className="notification" key={b.Bin_ID}>
    ⚠️ Bin {b.Bin_ID} in {b.Area} is almost full ({b.Waste_Level}%)
  </div>
))}

      {/* Bar Chart */}
      <h3>📊 Waste Chart</h3>
      <BarChart width={600} height={300} data={bins}>
  <XAxis dataKey="Area"/>
  <YAxis/>
  <Tooltip/>
  <Bar dataKey="Waste_Level" fill="#38bdf8" animationDuration={1500}/>
</BarChart>

      {/* Pie Chart */}
      <h3>📊 Waste Distribution</h3>

<PieChart width={400} height={300}>
  <Pie
    data={pieData}
    dataKey="value"
    outerRadius={100}
    animationDuration={1500}
    label={({ name, percent }) =>
      `${name} ${(percent * 100).toFixed(0)}%`
    }
  >
    {pieData.map((entry, index) => (
      <Cell
        key={index}
        fill={["#22c55e", "#facc15", "#ef4444"][index]}
      />
    ))}
  </Pie>
</PieChart>
<h3>📈 AI Waste Prediction</h3>

<LineChart width={600} height={300} data={predictionData}>
  <XAxis dataKey="name"/>
  <YAxis/>
  <Tooltip/>

  <Line
    type="monotone"
    dataKey="current"
    stroke="#38bdf8"
    strokeWidth={2}
  />

  <Line
    type="monotone"
    dataKey="predicted"
    stroke="#ef4444"
    strokeWidth={2}
    strokeDasharray="5 5"
  />
</LineChart>
    </div>
  )
}