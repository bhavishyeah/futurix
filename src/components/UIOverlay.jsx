import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function UIOverlay() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // This assumes the CanvasScrubber scroll duration is 400% (or 4 screens long)
    // We will trigger different UI elements at different scroll percentages

    // 1. Fade in the "Performance" text when the user starts scrolling the car
    gsap.fromTo(
      ".text-engine",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: "#canvas-container", // Matches the ID in CanvasScrubber
          start: "top top", // When the car pins
          end: "+=100%", // Animates during the first 100vh of scrolling
          scrub: true,
        },
      }
    );

    // 2. Hide "Performance" and fade in "Aerodynamics" text on the second scroll phase
    gsap.fromTo(
      ".text-aero",
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        scrollTrigger: {
          trigger: "#canvas-container",
          start: "top -100%", // Starts after the first 100vh of scrolling
          end: "+=100%", 
          scrub: true,
        },
      }
    );
  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
    >
      {/* 
        pointer-events-none ensures the user can still scroll the page,
        but we add pointer-events-auto to buttons so they can be clicked.
      */}

      {/* Frame 1: Engine Specs (Left Side) */}
      <div className="text-engine absolute top-1/4 left-10 md:left-24 text-white drop-shadow-lg">
        <h2 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400">
          V8 Twin Turbo
        </h2>
        <p className="text-xl md:text-2xl mt-4 max-w-sm backdrop-blur-md bg-white/10 p-4 rounded-xl border border-white/20">
          Experience raw, unadulterated power that pushes the limits of engineering.
        </p>
      </div>

      {/* Frame 2: Aerodynamics (Right Side) */}
      <div className="text-aero absolute top-1/3 right-10 md:right-24 text-white text-right drop-shadow-lg opacity-0">
        <h2 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-blue-500 to-cyan-400">
          Zero Drag
        </h2>
        <p className="text-xl md:text-2xl mt-4 max-w-sm ml-auto backdrop-blur-md bg-white/10 p-4 rounded-xl border border-white/20">
          Sculpted by the wind. Built for the track.
        </p>
      </div>

      {/* Gamification Element: A clickable "hotspot" button */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto">
        <button 
          onClick={() => alert("Ignition sequence started! 🚀🔥")}
          className="group relative px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/30 rounded-full hover:bg-white/10 transition-all duration-300"
        >
          <span className="text-white font-bold tracking-widest uppercase">Start Engine</span>
          {/* Your signature neon glow effect on hover */}
          <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(255,255,255,0)] group-hover:shadow-[0_0_20px_rgba(255,100,0,0.8)] transition-shadow duration-300"></div>
        </button>
      </div>
    </div>
  );
}