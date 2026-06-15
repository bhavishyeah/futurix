import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { compression } from "vite-plugin-compression2";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Gzip compression for production builds
    compression({
      algorithm: "gzip",
      threshold: 1024, // Only compress files > 1KB
      deleteOriginalAssets: false,
    }),
    // Brotli compression (better ratio, supported by modern browsers)
    compression({
      algorithm: "brotliCompress",
      threshold: 1024,
      deleteOriginalAssets: false,
    }),
  ],

  build: {
    // Target modern browsers for smaller output
    target: "es2020",
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Chunk size warning limit
    chunkSizeWarningLimit: 600,
    // Use default Rolldown minification (oxc-based, fast and efficient)
    minify: true,
    // Manual chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split Three.js into its own chunk (~600KB) - cached separately
          if (id.includes("node_modules/three/")) {
            return "three";
          }
          // React Three Fiber + Drei (depends on Three.js but separate chunk)
          if (id.includes("@react-three/fiber") || id.includes("@react-three/drei")) {
            return "react-three";
          }
          // GSAP and animation libraries
          if (id.includes("node_modules/gsap") || id.includes("@gsap/react")) {
            return "gsap";
          }
          // React core
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router-dom") ||
            id.includes("node_modules/scheduler")
          ) {
            return "react-vendor";
          }
          // Smooth scrolling
          if (id.includes("node_modules/lenis")) {
            return "lenis";
          }
        },
      },
    },
    // Asset handling
    assetsInlineLimit: 4096, // Inline assets < 4KB as base64
  },

  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "gsap",
      "lenis",
    ],
  },
});
