import { Link } from "react-router-dom"

export default function Layout({ children }) {
  return (
    <div className="layout">

      <div className="sidebar">
        <h2>🚀 Smart Waste</h2>

        <Link to="/">Dashboard</Link>
        <Link to="/map">Map</Link>
        <Link to="/route">Route</Link>
      </div>

      <div className="content">
        {children}
      </div>

    </div>
  )
}