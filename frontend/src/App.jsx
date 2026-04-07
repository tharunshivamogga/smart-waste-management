import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"

import Dashboard from "./pages/Dashboard"
import MapPage from "./pages/MapPage"
import RoutePage from "./pages/RoutePage"
import Login from "./pages/Login"
import Layout from "./components/Layout"

export default function App() {

  const [role, setRole] = useState(localStorage.getItem("role"))

  return (
    <BrowserRouter>

      {!role ? (
        <Login setRole={setRole} />
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

          {/* DRIVER */}
          {role === "driver" && (
            <Route path="/route" element={<Layout role={role}><RoutePage /></Layout>} />
          )}

          {/* DEFAULT */}
          <Route
            path="*"
            element={
              role === "admin"
                ? <Navigate to="/" />
                : <Navigate to="/route" />
            }
          />

        </Routes>
      )}

    </BrowserRouter>
  )
}