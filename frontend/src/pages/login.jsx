import { useState } from "react";

import { useNavigate } from "react-router-dom";

import "../styles/login.css";

import logo from "../assets/logo.png";

function LoginPage() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/login/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            username,
            password
          }),

          credentials: "include"
        }
      );

      const data = await res.json();

if (data.message) {

  localStorage.setItem(
    "username",
    username
  );

  if (data.is_staff) {

    navigate("/technician");

  } else {

    navigate("/home");
  }
} else {

        alert(data.error);
      }

    } catch (error) {

      alert("ERROR: " + error);
    }
  };

  return (

    <div className="login-page">

      <div className="login-card">
 <div className="login-left">

<h1 className="welcome-text">
Welcome to
</h1>

<img
src={logo}
alt="Smart Maintenance"
className="login-logo"
/>

</div>

        <div className="login-right">

          <h2>Login</h2>

          <input
            type="text"
            placeholder="Username"

            value={username}

            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"

            value={password}

            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button onClick={handleLogin}>
            Login
          </button>

          <p>
            Don't have an account?
          </p>

          <button
            className="signup-btn"

            onClick={() =>
              navigate("/signup")
            }
          >
            Sign Up
          </button>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;