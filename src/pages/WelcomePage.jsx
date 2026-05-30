// src/pages/WelcomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

export default function WelcomePage() {
  const navigate = useNavigate();

  const handleStartEngine = () => {
    // 1. Fire Confetti
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.8 }, colors: ['#ff0000', '#ffa500'] });

    // 2. Wait 1 second for the visual effect, then redirect to the Car Scrubber
    setTimeout(() => {
      navigate("/cars");
    }, 1000);
  };

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,30,0,0.2),transparent_60%)] pointer-events-none"></div>

      <div className="relative z-20 text-center px-4">
        <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter uppercase mb-4 drop-shadow-2xl">
          Apex <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">GT</span>
        </h1>
        <p className="text-lg md:text-2xl text-neutral-400 font-light max-w-2xl mx-auto mb-16 tracking-wide">
          The intersection of raw power and aerodynamic perfection.
        </p>

        {/* Start Engine Button */}
        <button 
          onClick={handleStartEngine}
          className="group relative px-12 py-6 bg-white/5 backdrop-blur-xl border border-red-500/30 rounded-full hover:bg-white/10 hover:border-red-500 transition-all duration-300 scale-100 hover:scale-105"
        >
          <span className="text-white font-bold tracking-widest text-xl uppercase shadow-black drop-shadow-lg">
            Start Engine
          </span>
          <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(255,0,0,0)] group-hover:shadow-[0_0_40px_rgba(255,50,0,0.6)] transition-shadow duration-300"></div>
        </button>
      </div>
    </section>
  );
}