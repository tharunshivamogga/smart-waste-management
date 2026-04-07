const BASE =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000"
    : "https://smart-waste-management-awpg.onrender.com"

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
  const r = await fetch(`${BASE}/prediction`)
  return { data: await r.json() }
}

export const getAnalysis = async () => {
  const r = await fetch(`${BASE}/analysis`)
  return { data: await r.json() }
}