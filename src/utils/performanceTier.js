/**
 * Performance Tier Detection Utility
 * Detects device capabilities and returns a performance tier for adaptive quality.
 * 
 * Tiers:
 *   "high"   - Desktop with dedicated GPU, 8+ cores
 *   "medium" - Mid-range devices, 4-6 cores, or mobile with decent GPU
 *   "low"    - Low-end mobile, 2-4 cores, low memory, integrated GPU
 */

let cachedTier = null;

export function getPerformanceTier() {
  if (cachedTier) return cachedTier;

  const nav = typeof navigator !== "undefined" ? navigator : {};
  const hardwareConcurrency = nav.hardwareConcurrency || 2;
  const deviceMemory = nav.deviceMemory || 2; // GB (Chrome only)
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(
    nav.userAgent || ""
  );
  const isLowEndMobile = isMobile && hardwareConcurrency <= 4;
  const hasReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Check WebGL capabilities
  let maxTextureSize = 4096;
  let gpuTier = "unknown";
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (gl) {
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        gpuTier = renderer.toLowerCase();
      }
      // Lose context to free memory
      const loseCtx = gl.getExtension("WEBGL_lose_context");
      if (loseCtx) loseCtx.loseContext();
    }
  } catch (e) {
    // WebGL not available
  }

  // Detect integrated/low-end GPUs
  const isLowGPU =
    gpuTier.includes("intel") ||
    gpuTier.includes("mesa") ||
    gpuTier.includes("swiftshader") ||
    gpuTier.includes("llvmpipe") ||
    gpuTier.includes("mali-4") ||
    gpuTier.includes("adreno 3") ||
    gpuTier.includes("adreno 4") ||
    gpuTier.includes("powervr");

  // Determine tier
  if (hasReducedMotion || (isLowEndMobile && deviceMemory <= 3) || isLowGPU) {
    cachedTier = "low";
  } else if (isMobile || hardwareConcurrency <= 4 || deviceMemory <= 4) {
    cachedTier = "medium";
  } else {
    cachedTier = "high";
  }

  return cachedTier;
}

/**
 * Get optimized settings based on performance tier
 */
export function getQualitySettings() {
  const tier = getPerformanceTier();

  const settings = {
    high: {
      dpr: [1, 2],
      envResolution: 256,
      antialias: true,
      shadowMap: true,
      maxLights: 4,
      useBlur: true,
      animationDuration: 1,
      scrubSmooth: 1.2,
      enableSmoothScroll: true,
      useFrameThrottle: 1, // every frame
      environmentPreset: "city",
    },
    medium: {
      dpr: [1, 1.5],
      envResolution: 128,
      antialias: true,
      shadowMap: false,
      maxLights: 3,
      useBlur: false,
      animationDuration: 0.7,
      scrubSmooth: 1.5,
      enableSmoothScroll: true,
      useFrameThrottle: 2, // every 2nd frame
      environmentPreset: "city",
    },
    low: {
      dpr: [1, 1],
      envResolution: 64,
      antialias: false,
      shadowMap: false,
      maxLights: 2,
      useBlur: false,
      animationDuration: 0.5,
      scrubSmooth: 2,
      enableSmoothScroll: false,
      useFrameThrottle: 3, // every 3rd frame
      environmentPreset: "apartment",
    },
  };

  return settings[tier];
}

/**
 * Check if the device is mobile
 */
export function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
}
