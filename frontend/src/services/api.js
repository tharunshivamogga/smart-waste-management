const BASE_URL = "https://smart-waste-management.onrender.com"

export const getBins = async () => {
  const res = await fetch(`${BASE_URL}/bins`)
  return await res.json()
}

export const getRoute = async () => {
  const res = await fetch(`${BASE_URL}/route`)
  return await res.json()
}

export const getAnalytics = async () => {
  const res = await fetch(`${BASE_URL}/analytics`)
  return await res.json()
}

export const updateBin = async (data) => {
  await fetch(`${BASE_URL}/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
}