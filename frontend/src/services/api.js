// import { ref, set } from "firebase/database"
// import { db } from "../firebase"

// export const updateBinRealtime = (bin) => {
//   set(ref(db, "bins/" + bin.Bin_ID), bin)
// }
const BASE =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000"
    : "https://smart-waste-management-awpg.onrender.com"

export const getBins = async () => {
  const r = await fetch(`${BASE}/bins`)
  return await r.json()
}

export const getRoute = async () => {
  const r = await fetch(`${BASE}/route`)
  return await r.json()
}

export const updateBin = async (data) => {
  await fetch(`${BASE}/update_bin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
}

export const getPrediction = async () => {
  const r = await fetch(`${BASE}/prediction`)
  return await r.json()
}
export const getAI = async () => {
  const r = await fetch(`${BASE}/ai_routes`)
  return await r.json()
}