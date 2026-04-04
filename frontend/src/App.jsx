import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"

import Layout from "./components/Layout.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import MapPage from "./pages/MapPage.jsx"
import RoutePage from "./pages/RoutePage.jsx"
import Login from "./pages/Login.jsx"

export default function App(){

  const [auth, setAuth] = useState(false)
  const [role, setRole] = useState("")

  // 🔐 LOGIN SCREEN
  if(!auth){
    return <Login setAuth={setAuth} setRole={setRole}/>
  }

  return(
    <BrowserRouter>
      <Layout>
        <Routes>
          {role === "admin" && <Route path="/" element={<Dashboard/>}/>}
          <Route path="/map" element={<MapPage/>}/>
          <Route path="/route" element={<RoutePage/>}/>
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}