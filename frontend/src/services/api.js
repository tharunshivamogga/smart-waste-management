const BASE = "https://smart-waste-management-awpg.onrender.com"

// ✅ SAFE FETCH HELPER
async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options)

    // ❗ handle non-JSON (like 404 HTML page)
    const text = await res.text()

    try {
      const data = JSON.parse(text)
      return data
    } catch {
      console.error("Not JSON response:", text)
      return null
    }

  } catch (e) {
    console.error("Fetch error:", e)
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

// ✅ PREDICTION
export const getPrediction = async () => {
  try {
    const res = await fetch(`${BASE}/prediction`)
    const data = await res.json()

    return {
      data: data.data || [],
      ai_accuracy: data.ai_accuracy || 0,
      ml_accuracy: data.ml_accuracy || 0,
      ai_rmse: data.ai_rmse || 0,
      ml_rmse: data.ml_rmse || 0
    }
  } catch (e) {
    console.error("Prediction error:", e)
    return {
      data: [],
      ai_accuracy: 0,
      ml_accuracy: 0,
      ai_rmse: 0,
      ml_rmse: 0
    }
  }
}

// ✅ ANALYSIS
export const getAnalysis = async () => {
  const data = await safeFetch(`${BASE}/analysis`)
  return { data: Array.isArray(data) ? data : [] }
}

// ✅ AI ROUTE (FIXED + SAFE)
export const getAIRoute = async () => {
  try {
    const res = await fetch(`${BASE}/ai_route`) // ✅ correct

    if (!res.ok) {
      console.error("404 or server error")
      return []
    }

    const data = await res.json()
    return Array.isArray(data) ? data : []

  } catch (e) {
    console.error("AI Route error:", e)
    return []
  }
}