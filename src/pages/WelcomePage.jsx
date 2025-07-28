import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>🔥 Collab Code</h1>
        <p>Collaborate in real-time, write code together, and build magic!</p>
        <button onClick={() => navigate("/login")}>🚀 Get Started</button>
      </div>
      <div className="welcome-illustration">
        <img src="https://wallpaperaccess.com/full/5675771.jpg" alt="Collaborative coding illustration" />
      </div>
    </div>
  );
}

export default WelcomePage;
