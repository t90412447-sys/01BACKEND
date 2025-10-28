// src/components/ParticlesBackground.jsx
import React from "react";

export default function ParticlesBackground() {
  const bubbles = Array.from({ length: 50 });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -10,
        overflow: "hidden",
        pointerEvents: "none",
        background: "transparent",
      }}
    >
      <style>
        {`
          @keyframes rise {
            0% { transform: translateY(0) scale(1); opacity: 0.3; }
            100% { transform: translateY(-110vh) scale(1.5); opacity: 0; }
          }
          .bubble {
            position: absolute;
            bottom: -10px;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, rgba(200,180,255,0.8), rgba(140,100,250,0.2));
            border-radius: 50%;
            animation: rise 20s linear infinite;
            opacity: 0.3;
          }
          .bubble:nth-child(odd) {
            width: 20px;
            height: 20px;
            animation-duration: 25s;
          }
          .bubble:nth-child(even) {
            animation-duration: 18s;
            opacity: 0.4;
          }
        `}
      </style>

      {bubbles.map((_, i) => (
        <span
          key={i}
          className="bubble"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 20}s`,
          }}
        />
      ))}
    </div>
  );
}
