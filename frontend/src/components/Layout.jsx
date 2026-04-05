import { Link } from "react-router-dom"

export default function Layout({ children, role }) {

  return (
    <div>

      <div className="sidebar">
        <h2>🚀 Smart Waste</h2>

        {role === "admin" && (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/map">Heatmap</Link>
          </>
        )}

        <Link to="/route">Truck Route</Link>

        <button onClick={()=>{
          localStorage.clear()
          window.location.reload()
        }}>Logout</button>
      </div>

      <div className="content">
        {children}
      </div>

    </div>
  )
}