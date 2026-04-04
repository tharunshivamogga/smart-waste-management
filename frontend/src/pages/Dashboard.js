import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts"

export default function Dashboard(){

  const [bins,setBins] = useState([])

  useEffect(()=>{
    fetch("http://127.0.0.1:5000/bins")
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

  return(
    <div>

      <h1>📊 Dashboard</h1>

      {/* Cards */}
      <div className="cards">
        <div className="card">Total Bins<br/><h2>{bins.length}</h2></div>
        <div className="card">Overflow<br/><h2>{overflow.length}</h2></div>
      </div>

      {/* Alerts */}
      <h3>🚨 Alerts</h3>
      {overflow.map(b=>(
        <div key={b.Bin_ID} className="alert">
          Bin {b.Bin_ID} in {b.Area} ({b.Waste_Level}%)
        </div>
      ))}

      {/* Bar Chart */}
      <h3>📊 Waste Chart</h3>
      <BarChart width={500} height={300} data={bins}>
        <XAxis dataKey="Area"/>
        <YAxis/>
        <Tooltip/>
        <Bar dataKey="Waste_Level" fill="#38bdf8"/>
      </BarChart>

      {/* Pie Chart */}
      <h3>📊 Waste Distribution</h3>

<PieChart width={400} height={300}>
  <Pie
    data={pieData}
    dataKey="value"
    cx="50%"
    cy="50%"
    outerRadius={100}
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

  <Tooltip />
</PieChart>

    </div>
  )
}