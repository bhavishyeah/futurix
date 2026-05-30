import React from "react";
import CanvasScrubber from "../components/CanvasScrubber";

export default function CarsPage() {
  return (
    <main className="cars-page min-h-screen w-full relative overflow-hidden">
      <div className="cars-video-zone relative z-10">
        <CanvasScrubber />
      </div>
    </main>
  );
}