import { useState } from "react";

import { useNavigate } from "react-router-dom";

import "../styles/Signup.css";
import logo from "../assets/logo.png";

function Signup() {

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("customer");

  const handleSignup = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/signup/",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            username,
            email,
            password,
            role,
          }),
        }
      );

      const data =
        await response.json();

      if (data.message) {

         navigate("/");

      } else {

        alert(data.error);
      }

    } catch (error) {

      console.error(error);

      alert("Signup failed");
    }
  };

  return (

    <div className="signup-page">

      <div className="signup-card">

       <div className="signup-left">

<h1 className="join-text">
Join
</h1>

<img
src={logo}
alt="Smart Maintenance"
className="signup-logo"
/>

</div>

        <div className="signup-right">

          <h2>Sign Up</h2>

          <input
            type="text"
            placeholder="Username"

            value={username}

            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Email"

            value={email}

            onChange={(e) =>
              setEmail(e.target.value)
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

          <select

            value={role}

            onChange={(e) =>
              setRole(e.target.value)
            }
          >

            <option value="customer">
              Customer
            </option>

            <option value="technician">
              Technician
            </option>

          </select>

          <button
            onClick={handleSignup}
          >
            Create Account
          </button>

          <p>
            Already have an account?
          </p>

          <button
            className="login-btn"

            onClick={() =>
              navigate("/")
            }
          >
            Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default Signup;