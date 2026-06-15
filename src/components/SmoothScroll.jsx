import { ReactLenis } from "lenis/react";
import { getQualitySettings } from "../utils/performanceTier";

const quality = getQualitySettings();

export default function SmoothScroll({ children }) {
  // Disable smooth scrolling on low-end devices to prevent RAF conflicts
  // with Three.js and GSAP (3 simultaneous animation loops = lag)
  if (!quality.enableSmoothScroll) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: quality.enableSmoothScroll ? 0.1 : 1, // Higher lerp = less processing
        smoothWheel: true,
        syncTouch: false, // Don't hijack touch scrolling on mobile
        touchMultiplier: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  );
}
