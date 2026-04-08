import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./styles.css"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})
function SafeApp() {
  try {
    return <App />
  } catch (e) {
    console.error("App crashed:", e)
    return <h1 style={{ color: "red" }}>App Crashed - Check Console</h1>
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <SafeApp />
)