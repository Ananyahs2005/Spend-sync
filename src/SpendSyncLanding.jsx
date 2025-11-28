import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./image.jpg";

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    background: "linear-gradient(90deg, #000 60%, #FFD700 100%)",
    fontFamily: "Montserrat, Arial, sans-serif",
  },
  logoSection: {
    flex: "0 0 40%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#000",
  },
  logoImg: {
    maxWidth: "80%",
    borderRadius: "20px",
    boxShadow: "0 0 40px #FFD700",
  },
  formSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },
  title: {
    color: "#FFD700",
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  tagline: {
    color: "#bfa500",
    fontSize: "1.1rem",
    marginBottom: "25px",
  },
  input: {
    fontSize: "1.1rem",
    padding: "12px 18px",
    borderRadius: "8px",
    border: "2px solid #FFD700",
    marginBottom: "18px",
    width: "100%",
    maxWidth: "320px",
    outline: "none",
  },
  btn: {
    fontSize: "1.1rem",
    color: "#fff",
    background: "#FFD700",
    border: "none",
    borderRadius: "8px",
    padding: "13px 38px",
    fontWeight: "bold",
    cursor: "pointer",
    margin: "0 10px",
  },
  btnSecondary: {
    background: "#000",
    color: "#FFD700",
    border: "2px solid #FFD700",
  },
  buttonsRow: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
  },
  info: {
    color: "#FFD700",
    marginBottom: "15px",
    fontWeight: "500",
  },
};

export default function SpendSyncLanding() {
  const [mode, setMode] = useState("register");
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerData, setRegisterData] = useState({
    fullname: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [info, setInfo] = useState("");
  const [registered, setRegistered] = useState([]);

  const navigate = useNavigate();

  // Handle Login
  function handleLogin(e) {
    e.preventDefault();
    if (!gmail || !password) {
      setInfo("Please fill all fields.");
    } else if (!registered.find((user) => user.email === gmail)) {
      setInfo("You must register first!");
    } else {
      const user = registered.find((user) => user.email === gmail);
      if (user.password === password) {
        setInfo("✅ Login successful!");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setInfo("❌ Incorrect password.");
      }
    }
  }

  // Handle Register
  function handleRegister(e) {
    e.preventDefault();
    if (
      !registerData.fullname ||
      !registerData.email ||
      !registerData.role ||
      !registerData.password
    ) {
      setInfo("Please fill all fields correctly!");
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setInfo("Passwords do not match.");
      return;
    }

    setRegistered((prev) => [...prev, registerData]);
    setInfo(`✅ Registered as: ${registerData.email}`);

    setTimeout(() => {
      setMode("login");
      setInfo("Please login now.");
      setGmail(registerData.email);
      setPassword("");
    }, 1500);
  }

  return (
    <div style={styles.container}>
      <div style={styles.logoSection}>
        <img src={logo} alt="SpendSync Logo" style={styles.logoImg} />
      </div>
      <div style={styles.formSection}>
        <h1 style={styles.title}>SPENDSYNC</h1>
        <p style={styles.tagline}>Lock it before you lose it</p>

        {info && <div style={styles.info}>{info}</div>}

        {mode === "login" && (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              style={styles.input}
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
              placeholder="Enter your Gmail address"
              required
            />
            <input
              type="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <div style={styles.buttonsRow}>
              <button type="submit" style={styles.btn}>Login</button>
              <button
                type="button"
                style={{ ...styles.btn, ...styles.btnSecondary }}
                onClick={() => {
                  setMode("register");
                  setInfo("");
                }}
              >
                Register
              </button>
            </div>
          </form>
        )}

        {mode === "register" && (
          <form onSubmit={handleRegister}>
            <input
              style={styles.input}
              type="text"
              placeholder="Full Name"
              value={registerData.fullname}
              onChange={(e) =>
                setRegisterData({ ...registerData, fullname: e.target.value })
              }
              required
            />
            <input
              style={styles.input}
              type="email"
              placeholder="Email Address"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
              required
            />
            <select
              style={styles.input}
              value={registerData.role}
              onChange={(e) =>
                setRegisterData({ ...registerData, role: e.target.value })
              }
              required
            >
              <option value="">-- Select Role --</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="counselor">Counselor</option>
            </select>
            <input
              style={styles.input}
              type="password"
              placeholder="Create password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
              required
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Re-enter password"
              value={registerData.confirmPassword}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  confirmPassword: e.target.value,
                })
              }
              required
            />
            <div style={styles.buttonsRow}>
              <button type="submit" style={styles.btn}>Register</button>
              <button
                type="button"
                style={{ ...styles.btn, ...styles.btnSecondary }}
                onClick={() => {
                  setMode("login");
                  setInfo("");
                }}
              >
                Go to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
