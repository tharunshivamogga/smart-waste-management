import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"

import Dashboard from "./pages/Dashboard"
import MapPage from "./pages/MapPage"
import RoutePage from "./pages/RoutePage"
import Login from "./pages/Login"
import Layout from "./components/Layout"

export default function App() {

  // ✅ LOAD FROM LOCAL STORAGE (IMPORTANT)
  const [role, setRole] = useState(null)
  const [auth, setAuth] = useState(false)

  return (
    <BrowserRouter>

      {!auth ? (
        <Login setAuth={setAuth} setRole={setRole} />
      ) : (
        <Routes>

          {/* ADMIN */}
          {role === "admin" && (
            <>
              <Route path="/" element={<Layout role={role}><Dashboard /></Layout>} />
              <Route path="/map" element={<Layout role={role}><MapPage /></Layout>} />
              <Route path="/route" element={<Layout role={role}><RoutePage /></Layout>} />
            </>
          )}

          {/* DRIVER 1 */}
          {role === "driver" && (
            <Route path="/route" element={<Layout role={role}><RoutePage /></Layout>} />
          )}

          {/* DRIVER 2 */}
          {role === "driver2" && (
            <Route path="/route" element={<Layout role={role}><RoutePage /></Layout>} />
          )}

          {/* FALLBACK */}
          <Route
            path="*"
            element={
              role === "admin"
                ? <Navigate to="/" replace />
                : <Navigate to="/route" replace />
            }
          />

        </Routes>
      )}

    </BrowserRouter>
  )
}