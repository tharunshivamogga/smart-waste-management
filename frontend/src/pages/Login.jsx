import { useState } from "react"

export default function Login({ setAuth, setRole }) {

  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")

  function login() {

    if (user === "admin" && pass === "1234") {
      setAuth(true)
      setRole("admin")
      localStorage.setItem("role", "admin")
    }

    else if (user === "driver" && pass === "1234") {
      setAuth(true)
      setRole("driver")
      localStorage.setItem("role", "driver")
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