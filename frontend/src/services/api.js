
import axios from "axios"
const BASE_URL = "https://your-backend-url.onrender.com"

export const getStats=()=>axios.get(API+"/stats")
export const getBins=()=>axios.get(API+"/bins")
export const getAnalytics=()=>axios.get(API+"/analytics")
export const getRoute=()=>axios.get(API+"/route")
export const updateBin=(data)=>axios.post(API+"/update_bin",data)
