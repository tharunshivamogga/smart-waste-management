import { useState } from "react"

export default function Login({ setAuth, setRole }) {

  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")

  function login() {

    if (user === "admin" && pass === "1234") {
      localStorage.setItem("auth", "true")
      localStorage.setItem("role", "admin")

      setAuth(true)
      setRole("admin")
    }

    else if (user === "driver" && pass === "1234") {
      localStorage.setItem("auth", "true")
      localStorage.setItem("role", "driver")

      setAuth(true)
      setRole("driver")
    }

    else {
      alert("Invalid credentials")
    }
  }

  return (
    <div className="login">
      <h2>🔐 Smart Waste Login</h2>

      <input placeholder="Username" onChange={e=>setUser(e.target.value)}/>
      <input type="password" placeholder="Password" onChange={e=>setPass(e.target.value)}/>

      <button onClick={login}>Login</button>
    </div>
  )
}