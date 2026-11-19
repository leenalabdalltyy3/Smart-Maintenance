//Controls page routing
import { useState, useEffect } from "react";
import Signup from "./pages/Signup";

import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import AiDiagnosis
from "./pages/AiDiagnosis";

import Booking from "./pages/Booking";
import Home from "./pages/Home";
import LoginPage from "./pages/login";
import TechnicianDashboard

from "./pages/TechnicianDashboard";

import ManageSchedule
from "./pages/ManageSchedule";


// 🌐 MAIN ROUTER
export default function App() {

  return (

    <BrowserRouter>

      <Routes>
        <Route
          path="/technician"
          element={<TechnicianDashboard />}
        />

        <Route
          path="/"
          element={<LoginPage />}
        />

        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/assistant"
          element={<AiDiagnosis />}
        />

        <Route
          path="/booking"
          element={<Booking />}
        />
        <Route
          path="/signup"
          element={<Signup />}
        />
        <Route
          path="/manage-schedule"
          element={
        <ManageSchedule/>
        }
        />
      </Routes>

    </BrowserRouter>
  );
}