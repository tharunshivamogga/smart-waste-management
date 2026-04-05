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
    getBins().then(data => {
      setBins(data)

      // 🔔 Notification
      data.forEach(b => {
        if (b.Waste_Level > 90) {
          notify(`🚨 ${b.Area} overflow`)
        }
      })
    })

    getPrediction().then(setPred)
  }

  function notify(msg) {
    if (Notification.permission === "granted") {
      new Notification(msg)
    } else {
      Notification.requestPermission()
    }
  }

  const pieData = [
    { name: "Low", value: bins.filter(b=>b.Waste_Level<40).length },
    { name: "Medium", value: bins.filter(b=>b.Waste_Level>=40 && b.Waste_Level<80).length },
    { name: "High", value: bins.filter(b=>b.Waste_Level>=80).length }
  ]

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
          <h2>{bins.filter(b=>b.Waste_Level>80).length}</h2>
        </div>
      </div>

      {/* Alerts */}
      <h3>🚨 Alerts</h3>
      {bins.filter(b=>b.Waste_Level>80).map(b=>(
        <div key={b.Bin_ID} className="alert">
          {b.Area} - {b.Waste_Level}%
        </div>
      ))}

      {/* Line Chart */}
      <h3>📈 ML Prediction</h3>
      <LineChart width={500} height={300} data={pred.map((p,i)=>({i,p}))}>
        <XAxis dataKey="i"/>
        <YAxis/>
        <Tooltip/>
        <Line dataKey="p" stroke="#38bdf8"/>
      </LineChart>

      {/* Pie Chart */}
      <h3>📊 Waste Distribution</h3>
      <PieChart width={300} height={300}>
        <Pie data={pieData} dataKey="value" outerRadius={100}>
          <Cell fill="#22c55e"/>
          <Cell fill="#facc15"/>
          <Cell fill="#ef4444"/>
        </Pie>
      </PieChart>

    </div>
  )
}