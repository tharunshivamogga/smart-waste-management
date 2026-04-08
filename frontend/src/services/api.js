const BASE =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000"
    : "https://smart-waste-management-awpg.onrender.com" // 🔥 YOUR RENDER URL

export const getBins = async () => {
  const r = await fetch(`${BASE}/bins`)
  return { data: await r.json() }
}

export const updateBin = async (data) => {
  await fetch(`${BASE}/update_bin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
}

export const getPrediction = async () => {
  try {
    const r = await fetch(`${BASE}/prediction`)
    const data = await r.json()

    if (!Array.isArray(data)) return { data: [] }

    return { data }
  } catch (e) {
    console.error("Prediction error:", e)
    return { data: [] }
  }
}
export const getAnalysis = async () => {
  const r = await fetch(`${BASE}/analysis`)
  return { data: await r.json() }
}
export const getAIRoute = () => fetch(`${BASE}/ai_route`).then(res => res.json())