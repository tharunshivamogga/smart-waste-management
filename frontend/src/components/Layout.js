import { Link } from "react-router-dom"

export default function Layout({ children }) {
  return (
    <div className="layout">

      <div className="sidebar">
        <h2>🚀 Smart Waste</h2>

        <Link to="/">Dashboard</Link>
        <Link to="/map">Heatmap</Link>
        <Link to="/route">Truck Route</Link>
      </div>

      <div className="main">
        {children}
      </div>

    </div>
  )
}