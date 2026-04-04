import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"

import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import MapPage from "./pages/MapPage"
import RoutePage from "./pages/RoutePage"
import Login from "./pages/Login"

export default function App(){

  const [auth,setAuth] = useState(false)

  // 🔐 Login system
  if(!auth){
    return <Login setAuth={setAuth}/>
  }

  return(
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/map" element={<MapPage/>}/>
          <Route path="/route" element={<RoutePage/>}/>
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}