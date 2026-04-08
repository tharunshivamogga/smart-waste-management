import { NavLink } from "react-router-dom"

export default function Layout({ children, role }) {

  return (
    <div>
<div className="sidebar">
  <h2>🚀 Smart Waste</h2>

  <div className="nav-links">

    {role === "admin" && (
      <>
        <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>📊 Dashboard</NavLink>
        <NavLink to="/map" className={({ isActive }) => isActive ? "active" : ""}>🗺 Map</NavLink>
      </>
    )}

    <NavLink to="/route" className={({ isActive }) => isActive ? "active" : ""}>🚛 Route</NavLink>

  </div>

  <button className="logout-btn" onClick={()=>{
    localStorage.clear()
    window.location.reload()
  }}>
    Logout
  </button>
</div>

      <div className="content">
        {children}
      </div>

    </div>
  )
}