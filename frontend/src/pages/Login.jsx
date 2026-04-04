import { useState } from "react"

export default function Login({ setAuth, setRole }) {

  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")

  function login() {

    if(user === "admin" && pass === "admin"){
      setRole("admin")
      setAuth(true)
    }
    else if(user === "driver" && pass === "driver"){
      setRole("driver")
      setAuth(true)
    }
    else{
      alert("Invalid credentials")
    }
  }

  return (
    <div className="login">
      <h2>🔐 Smart Waste Login</h2>

      <input onChange={e=>setUser(e.target.value)} placeholder="Username"/>
      <input onChange={e=>setPass(e.target.value)} placeholder="Password" type="password"/>

      <button onClick={login}>Login</button>
    </div>
  )
}