import { useState } from "react"

export default function Login({ setAuth }){

  const [user,setUser]=useState("")
  const [pass,setPass]=useState("")

  function login(){
    if(user==="admin" && pass==="1234"){
      setAuth(true)
    }else{
      alert("Invalid credentials")
    }
  }

  return(
    <div style={{display:"flex",justifyContent:"center",marginTop:"100px"}}>

      <div className="card">
        <h2>🔐 Login</h2>

        <input placeholder="Username" onChange={e=>setUser(e.target.value)}/>
        <input placeholder="Password" type="password" onChange={e=>setPass(e.target.value)}/>

        <button onClick={login}>Login</button>
      </div>

    </div>
  )
}