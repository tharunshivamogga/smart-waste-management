import { useState, useEffect } from "react"

export default function Login({ setAuth, setRole }) {

  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  function login() {

    setLoading(true)

    setTimeout(() => {

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

      else if (user === "driver2" && pass === "1234") {
        localStorage.setItem("auth", "true")
        localStorage.setItem("role", "driver2")

        setAuth(true)
        setRole("driver2")
      }

      else {
        alert("Invalid credentials")
      }

      setLoading(false)

    }, 800) // 🔥 animation delay
  }

  // 🔥 PARTICLES BACKGROUND
  useEffect(() => {
    const canvas = document.getElementById("particles")
    const ctx = canvas.getContext("2d")

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let particles = []

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3,
        dx: Math.random() - 0.5,
        dy: Math.random() - 0.5
      })
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = "#38bdf8"
        ctx.fill()

        p.x += p.dx
        p.y += p.dy

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <div style={styles.container}>

      <canvas id="particles" style={styles.canvas}></canvas>

      <div style={styles.card}>

        <h1 style={styles.title}>🚀 Smart Waste</h1>

        {/* USERNAME */}
        <div style={styles.inputBox}>
          <input
            required
            onChange={e => setUser(e.target.value)}
            style={styles.input}
          />
          <label style={styles.label}>Username</label>
        </div>

        {/* PASSWORD */}
        <div style={styles.inputBox}>
          <input
            type={show ? "text" : "password"}
            required
            onChange={e => setPass(e.target.value)}
            style={styles.input}
          />
          <label style={styles.label}>Password</label>

          <span
            onClick={() => setShow(!show)}
            style={styles.eye}
          >
            {show ? "🙈" : "👁"}
          </span>
        </div>

        {/* BUTTON */}
        <button onClick={login} style={styles.button}>
          {loading ? "Loading..." : "Login"}
        </button>

        {/* HINT */}
        <div style={styles.hints}>
          <p>👨‍💼 admin / ****</p>
          <p>🚛 driver / ****</p>
          <p>🚛 driver2 / ****</p>
        </div>

      </div>
    </div>
  )
}

const styles = {

  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#020617",
    overflow: "hidden"
  },

  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0
  },

  card: {
    position: "relative",
    zIndex: 1,
    width: "350px",
    padding: "30px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(15px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },

  title: {
    textAlign: "center",
    color: "#38bdf8"
  },

  inputBox: {
    position: "relative"
  },

  input: {
    width: "100%",
    padding: "12px",
    background: "transparent",
    border: "1px solid #334155",
    borderRadius: "10px",
    color: "white",
    outline: "none"
  },

  label: {
    position: "absolute",
    left: "12px",
    top: "-8px",
    fontSize: "12px",
    background: "#020617",
    padding: "0 5px",
    color: "#94a3b8"
  },

  eye: {
    position: "absolute",
    right: "10px",
    top: "10px",
    cursor: "pointer"
  },

  button: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg,#0ea5e9,#22c55e)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s"
  },

  hints: {
    textAlign: "center",
    fontSize: "12px",
    color: "#94a3b8"
  }
}