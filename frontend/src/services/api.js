const BASE = "https://smart-waste-management-awpg.onrender.com"

// ✅ UNIVERSAL SAFE FETCH
async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options)

    const text = await res.text()

    try {
      return JSON.parse(text)
    } catch {
      console.error("❌ Not JSON:", text)
      return null
    }

  } catch (e) {
    console.error("❌ Fetch error:", e)
    return null
  }
}

// ✅ GET BINS
export const getBins = async () => {
  const data = await safeFetch(`${BASE}/bins`)
  return { data: Array.isArray(data) ? data : [] }
}

// ✅ UPDATE BIN
export const updateBin = async (data) => {
  await safeFetch(`${BASE}/update_bin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
}

// ✅ 🔥 FIXED PREDICTION (MAIN FIX)
export const getPrediction = async () => {

  const res = await safeFetch(`${BASE}/prediction`)

  // ❗ IMPORTANT: HANDLE NULL / WRONG RESPONSE
  if (!res || !res.data) {
    console.error("❌ Prediction API failed")
    return {
      data: [],
      ai_accuracy: 0,
      ml_accuracy: 0,
      ai_rmse: 0,
      ml_rmse: 0
    }
  }

  return {
    data: Array.isArray(res.data) ? res.data : [],
    ai_accuracy: Number(res.ai_accuracy || 0),
    ml_accuracy: Number(res.ml_accuracy || 0),
    ai_rmse: Number(res.ai_rmse || 0),
    ml_rmse: Number(res.ml_rmse || 0)
  }
}

// ✅ ANALYSIS
export const getAnalysis = async () => {
  const data = await safeFetch(`${BASE}/analysis`)
  return { data: Array.isArray(data) ? data : [] }
}

// ✅ AI ROUTE
export const getAIRoute = async () => {
  const data = await safeFetch(`${BASE}/ai_route`)
  return Array.isArray(data) ? data : []
}