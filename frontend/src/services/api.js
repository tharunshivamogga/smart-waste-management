// import { ref, set } from "firebase/database"
// import { db } from "../firebase"

// export const updateBinRealtime = (bin) => {
//   set(ref(db, "bins/" + bin.Bin_ID), bin)
// }
const LOCAL = "http://localhost:5000"
const RENDER = "https://smart-waste-management-awpg.onrender.com"

const BASE =
  window.location.hostname === "localhost" ? LOCAL : RENDER

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