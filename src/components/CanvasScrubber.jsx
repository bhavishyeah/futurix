import React, { Suspense, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, Text, useGLTF, Html, useProgress } from "@react-three/drei";
gsap.registerPlugin(ScrollTrigger);


function SceneTitle() {
  return (
    <>
      <Text
      font="/fonts/Conthrax-SemiBold.otf"
        position={[0, 2.8, -2]}
        fontSize={0.16}
        color="#ff0000"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
      >
        TAKUMI MASTER CRAFTSMEN
      </Text>

      <Text
        font="/fonts/PLANK___.TTF"
        position={[0, 2, -2]}
        fontSize={1.05}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.04}
        maxWidth={14}
      >
        NISSAN GTR  
      </Text>
    </>
  );
}

function CarModel() {
  const { scene } = useGLTF("/models/nissangtr-draco.glb");

  return (
    <group position={[0, -1.6, -0.1]} 
    scale={180}
    rotation={[0.01, 0.1, 0]}>
    <primitive object={scene} />
    </group>
  );
}

function RotatingShowroom({ progressRef }) {
  const carRef = useRef();
  const textRef = useRef();

  useFrame((state) => {
    if (!carRef.current || !textRef.current) return;
    
    // Base values
    const autoTime = state.clock.elapsedTime;
    const scrollValue = progressRef.current;
    
    // --- CAR SPEED ---
    // Auto-rotates at 0.15 speed, and spins 1 full time (Math.PI * 2) per scroll
    carRef.current.rotation.y = (autoTime * 0.20) + (scrollValue * Math.PI * 2);
    
    // --- TEXT SPEED ---
    // Slower auto-rotation (0.05) and slower scroll rotation (Math.PI * 1)
    // Change these numbers to make it orbit faster, slower, or even backwards (use negative numbers)
    textRef.current.rotation.y = (autoTime * 0.55) + (scrollValue * Math.PI * 1);
  });

  return (
    <>
      {/* Text Group */}
      <group ref={textRef}>
        <SceneTitle />
      </group>

      {/* Car Group */}
      <group ref={carRef}>
        <CarModel />
      </group>
    </>
  );
}

useGLTF.preload("/models/nissangtr-draco.glb");

function Loader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="premium-loader">
<span className="loader-text">
  INITIALIZING ENGINE<span className="typing-dots"></span>
</span>
        <div className="loader-bar">
          <div
            className="loader-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </Html>
  );
}
function SectionMarquee({
  items = ["GT-R", "NISMO", "HERITAGE", "PRECISION", "LEGACY"],
  className = "",
}) {
  const content = [...items, ...items];

  return (
    <div className={`section-marquee ${className}`} aria-hidden="true">
      <div className="section-marquee-track">
        {content.map((item, index) => (
          <span className="section-marquee-item" key={`${item}-${index}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function CanvasScrubber() {
  const containerRef = useRef(null);
    const pageRef = useRef(null);

  const progressRef = useRef(0);

 useEffect(() => {
  if (!containerRef.current) return;

  const trigger = ScrollTrigger.create({
    trigger: containerRef.current,
    start: "top top",
    end: "+=280%",
    scrub: 1.2,
    pin: true,
    anticipatePin: 1,
    onUpdate: (self) => {
      progressRef.current = self.progress;
    },
  });

  return () => {
    trigger.kill();
  };
}, []);

useEffect(() => {
    const ctx = gsap.context(() => {
    const staggerGroups = gsap.utils.toArray(".specs-stagger");
    const counters = gsap.utils.toArray(".metric-value");
    const textRevealEls = gsap.utils.toArray(".specs-reveal:not(.specs-image-reveal)");
    const imageRevealEls = gsap.utils.toArray(".specs-image-reveal");
 

textRevealEls.forEach((el) => {
  gsap.fromTo(
    el,
    { autoAlpha: 0, y: 48, filter: "blur(8px)" },
    {
      autoAlpha: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 94%",
        toggleActions: "play none none reverse",
      },
    }
  );
});

imageRevealEls.forEach((el) => {
  gsap.fromTo(
    el,
    { autoAlpha: 0, y: 90, scale: 0.92, filter: "blur(12px)" },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top 98%",
        end: "top 62%",
        scrub: 1,
      },
    }
  );
});

    staggerGroups.forEach((group) => {
      gsap.fromTo(
        group.children,
        { autoAlpha: 0, y: 36, filter: "blur(6px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: group,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    counters.forEach((counter) => {
      const endValue = Number(counter.dataset.count) || 0;
      const state = { value: 0 };

      ScrollTrigger.create({
        trigger: counter,
        start: "top 92%",
        once: true,
        onEnter: () => {
          gsap.to(state, {
            value: endValue,
            duration: 1.2,
            ease: "power2.out",
            onUpdate: () => {
              counter.textContent = Math.round(state.value).toLocaleString();
            },
          });
        },
      });
    });

    ScrollTrigger.refresh();
  }, pageRef);

  return () => ctx.revert();
}, []);



 return (
   <div ref={pageRef}>
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-transparent"
    >
      <div className="canvas-shell relative w-full h-full">

           <Canvas
             dpr={[1, 1.5]}
             className="canvas-element relative z-20"
             camera={{ position: [7, 0, 10], fov: 30 }}  
              gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
              onCreated={({ gl, camera }) => {
              gl.setClearColor(0x000000, 0);
              camera.lookAt(0, 0, 0);
              }}
            >
            <Suspense fallback={<Loader />}>
            <ambientLight intensity={2.2} />
            <directionalLight position={[5, 5, 5]} intensity={3} />
            <directionalLight position={[-5, 5, -5]} intensity={2} />
            <Environment preset="city" resolution={256}/>
            
            {/* Wrapped both the text and car together here */}
            <RotatingShowroom progressRef={progressRef} />

            <OrbitControls
              enablePan={false}
              enableZoom={false}
              enableDamping={true}
              dampingFactor={0.08}
              minPolarAngle={Math.PI / 2}
              maxPolarAngle={Math.PI / 2}
            />
          </Suspense>
        </Canvas>
      </div>
    </section>

<section className="specs-section specs-section--first">
  
    <div className="specs-shell">

    <article className="spec-panel specs-reveal specs-image-reveal">
      <div className="spec-copy">
        <div className="spec-dots">
          {Array.from({ length: 12 }).map((_, i) => <span key={i}></span>)}
        </div>
        <p className="spec-kicker">Powertrain / Core unit</p>
        <h2 className="spec-title">ENGINE</h2>
        <h3 className="spec-subtitle">3.8L Twin-Turbo V6</h3>
        <p className="spec-desc">
          Hand-built for relentless response, the GT-R powertrain balances brutal
          straight-line urgency with high-speed stability and mechanical precision.
        </p>
        <div className="spec-rule"></div>
        <div className="spec-metrics specs-stagger">
          <div className="metric-box">
            <span className="metric-value" data-count="565">0</span>
            <span className="metric-label">Horsepower</span>
          </div>
          <div className="metric-box">
            <span className="metric-value" data-count="633">0</span>
            <span className="metric-label">Nm Torque</span>
          </div>
          <div className="metric-box">
            <span className="metric-value" data-count="315">0</span>
            <span className="metric-label">Km/h Top Speed</span>
          </div>
        </div>
      </div>

      <div className="spec-visual specs-reveal specs-image-reveal">  
              <div className="spec-stage">
        <img
          src="/images/nissangtr1.png"
          alt="Engine showcase"
           loading="lazy"
  decoding="async" 
          className="spec-stage-image first-img"
          style={{ width: "700px", height: "500px" }}
        />
      </div>
      </div>
    </article>
    </div>
</section>

<section className="marquee-wrapper">
  <div className="marquee-track">
    <span className="marquee-text marquee-outline">NISSAN GTR</span>
    <span className="marquee-text marquee-black">NISSAN GTR</span>
    <span className="marquee-text marquee-red">NISSAN GTR</span>

    <span className="marquee-text marquee-outline">NISSAN GTR</span>
    <span className="marquee-text marquee-black">NISSAN GTR</span>
    <span className="marquee-text marquee-red">NISSAN GTR</span>

    <span className="marquee-text marquee-outline">NISSAN GTR</span>
    <span className="marquee-text marquee-black">NISSAN GTR</span>
    <span className="marquee-text marquee-red">NISSAN GTR</span>
    </div>
    </section>



     <section className="specs-section specs-section--reverse">
     <div className="specs-shell">
     <article className="spec-panel specs-reveal">
      <div className="spec-copy">
        <div className="spec-dots">
          {Array.from({ length: 12 }).map((_, i) => <span key={i}></span>)}
        </div>
        <p className="spec-kicker">Drive / Mechanical grip</p>
        <h2 className="spec-title">Drivetrain</h2>
        <h3 className="spec-subtitle">Advanced All-Wheel Drive</h3>
        <p className="spec-desc">
          Intelligent torque distribution sharpens traction under launch,
          corners, and unstable load transitions for a planted high-speed character.
        </p>
        <div className="spec-rule"></div>

        <div className="spec-metrics specs-stagger">
          <div className="metric-box">
            <span className="metric-value" data-count="4">0</span>
            <span className="metric-label">Driven Wheels</span>
          </div>
          <div className="metric-box">
            <span className="metric-value" data-count="50">0</span>
            <span className="metric-label">Torque Split Logic</span>
          </div>
          <div className="metric-box">
            <span className="metric-value" data-count="1">0</span>
            <span className="metric-label">AWD System</span>
          </div>
        </div>
      </div>

      <div className="spec-visual specs-reveal specs-image-reveal">        
        <div className="spec-stage">
          
          <img src="/images/nissangtr2.png" 
           loading="lazy"
  decoding="async" 
          className="spec-stage-image second-img"
          alt="Drivetrain showcase" />
        </div>
      </div>
    </article>
    </div>
</section>

<SectionMarquee items={["Engine", "VR38DETT", "Twin Turbo", "NISMO"]} />

<section className="specs-section">
  <div className="specs-shell">
    <article className="spec-panel specs-reveal">
      <div className="spec-copy">
        <div className="spec-dots">
          {Array.from({ length: 12 }).map((_, i) => <span key={i}></span>)}
        </div>
        <p className="spec-kicker">Performance / Aero efficiency</p>
        <h2 className="spec-title">PERFORMANCE</h2>
        <h3 className="spec-subtitle">Enhanced aerodynamics</h3>
        <p className="spec-desc">
          GT-R NISMO’s aerodynamics cut like a knife for unmatched on-road thrills.
          Nissan highlights the carbon-fiber rear spoiler, redesigned front and rear
          fascias, carbon-fiber side sills, and fender vents as part of its aero-focused setup.
        </p>
        <div className="spec-rule"></div>
      </div>

      <div className="spec-visual specs-reveal specs-image-reveal">  
              <div className="spec-stage">
          <img
           loading="lazy"
  decoding="async" 
            src="/images/nissangtr4.png"
            className="spec-stage-image fourth-img"
            alt="GT-R NISMO aerodynamic detail"
          />
        </div>
      </div>
    </article>
  </div>
</section>
<SectionMarquee items={["Nissan", "GT-R", "NISMO", "R35"]} />


<section className="specs-section carbon-roof-section">
  <div className="specs-shell">
    <article className="carbon-roof-layout specs-reveal">
      <div className="carbon-left">
        <div className="spec-dots">
          {Array.from({ length: 12 }).map((_, i) => <span key={i}></span>)}
        </div>
        <p className="spec-kicker">Carbon / Weight reduction</p>
        <h2 className="carbon-title">CARBON FIBER</h2>
      </div>

      <div className="carbon-center specs-reveal specs-image-reveal">
        <img
         loading="lazy"
  decoding="async" 
           src="/images/nissangtr3.png"
            className="spec-stage-image third-img"
        />
      </div>

      <div className="carbon-right">
        <h3 className="carbon-subtitle">Carbon-fiber roof</h3>
        <p className="carbon-desc">
          The carbon-fiber roof is part of Nissan’s larger weight-reduction strategy.
          Compared with non-NISMO models, it helps lower the center of gravity,
          improve weight distribution, and sharpen cornering turn-in.
        </p>
        <div className="spec-rule"></div>
      </div>
    </article>
  </div>
</section>
<SectionMarquee items={["Carbon Fiber", "Lightweight", "Roofline", "Precision"]} />


<section className="specs-section">
  <div className="specs-shell">
    <article className="spec-panel specs-reveal">
      <div className="spec-copy">
        <div className="spec-dots">
          {Array.from({ length: 12 }).map((_, i) => <span key={i}></span>)}
        </div>
        <p className="spec-kicker">Package / Collector details</p>
        <h2 className="spec-title">EXCLUSIVE PACKAGE</h2>
        <h3 className="spec-subtitle">NISMO Appearance Package</h3>
        <p className="spec-desc">
          Nissan lists three standout elements in the NISMO Appearance Package:
          a Special Edition Takumi certification plate, 20-inch NISMO Special Edition
          Black RAYS forged-alloy wheels, and a clear-coated carbon-fiber hood.
        </p>
        <div className="spec-rule"></div>

        <div className="spec-package-list specs-stagger">
          <div className="package-chip">Special Edition Takumi certification plate</div>
          <div className="package-chip">20" NISMO Special Edition Black RAYS forged-alloy wheels</div>
          <div className="package-chip">Clear-coated carbon-fiber hood</div>
        </div>
      </div>

      <div className="spec-visual specs-reveal specs-image-reveal">  
              <div className="spec-stage">
          <img
           loading="lazy"
  decoding="async" 
src="/images/nissangtr5.png"
                      className="spec-stage-image fifth-img"
                                  alt="GT-R NISMO Appearance Package detail"
          />
        </div>
      </div>
    </article>
  </div>
</section>

<SectionMarquee items={["Engine", "VR38DETT", "Twin Turbo", "NISMO"]} />


<section className="specs-section heritage-section">
  <div className="specs-shell heritage-shell">
    <article className="heritage-layout specs-reveal">
      <div className="heritage-top">
        <p className="spec-kicker heritage-kicker">Motorsport / Legacy</p>
        <h2 className="heritage-title">NISMO HERITAGE</h2>
        <h3 className="heritage-subtitle">
          A legacy of unmatched dominance in GT500
        </h3>
        <p className="heritage-desc">
          GT-R NISMO showcases Nissan’s passion for motorsport. Nissan says the R35
          GT-R-based GT500 racer debuted in 2008, won seven of its first nine races,
          collected 41 wins across 14 seasons, and a NISMO GT-R GT3 racer also won
          the 2022 GT300 championships.
        </p>

        <div className="heritage-stats specs-stagger">
          <div className="metric-box">
            <span className="metric-value" data-count="2008">0</span>
            <span className="metric-label">GT500 Debut</span>
          </div>
          <div className="metric-box">
            <span className="metric-value" data-count="41">0</span>
            <span className="metric-label">Wins</span>
          </div>
          <div className="metric-box">
            <span className="metric-value" data-count="14">0</span>
            <span className="metric-label">Seasons</span>
          </div>
        </div>
      </div>

      <div className="heritage-media specs-reveal specs-image-reveal">
          <div className="heritage-image-wrap">

        <img
         loading="lazy"
  decoding="async" 
          alt="Nissan GT-R NISMO motorsport heritage"
          src="/images/nissangtr6.png"
          className="spec-stage-image sixth-img"/>
      </div>
      </div>
    </article>
  </div>
</section>
<SectionMarquee items={["GT500", "41 Wins", "14 Seasons", "Motorsport Legacy"]} />


<section className="logo-end-image">
  <div className="logo-end-image-wrap">
    <img
     loading="lazy"
  decoding="async" 
      src="/images/nissanlogo.png"
      alt="Nissan logo"
      className="logo-end-image-el"
    />
  </div>
</section>
  </div>
);
}