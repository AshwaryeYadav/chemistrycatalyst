import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

export function LightspeedHero() {
  const companyGroups = [
    ["Stripe", "Anthropic", "Anduril"],
    ["Wiz", "Glean", "Rubrik"],
    ["Anduril", "Rubrik", "Mulesoft"],
    ["Snap", "Mulesoft", "Nest"],
    ["AppDynamics", "Nutanix", "UiPath"],
    ["Affirm", "MindBody", "Nicira"],
  ];

  const descriptions = ["builders", "founders", "engineers", "hackers"];

  const [currentGroup, setCurrentGroup] = useState(0);
  const [currentDescription, setCurrentDescription] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentGroup((prev) => (prev + 1) % companyGroups.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isPaused, companyGroups.length]);

  useEffect(() => {
    const descInterval = setInterval(() => {
      setCurrentDescription((prev) => (prev + 1) % descriptions.length);
    }, 4000);
    return () => clearInterval(descInterval);
  }, [descriptions.length]);

  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x: x * 20, y: y * 20 });
      }
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  // Morph styles (fixed alignment)
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      /* How much higher the stem top moves on hover: 160px * (1.15 - 1) */
      .hover-campanile-container { --lift: 24px; }

      /* Make sure nothing gets clipped when the head rises */
      .hover-campanile-container,
      .glyph-container,
      .glyph-container svg { overflow: visible; }

      /* L pieces */
      #stem { transform-origin: 50% 100%; transition: transform .5s cubic-bezier(.4,0,.2,1); }
      #foot { transform-origin: 50% 100%; transition: transform .5s cubic-bezier(.4,0,.2,1); }

      /* Tower rides with the stem's top-center */
      #tower { transform: translateY(0); transition: transform .5s cubic-bezier(.4,0,.2,1), opacity .35s ease; opacity: 0; }

      /* Tower parts grow in place (from the stem top) */
      #belfry, #cap { transform-origin: 50% 100%; transform: scaleY(0); transition: transform .35s ease .1s; }
      #clock        { transform-origin: 50% 50%;  transform: scale(0);   transition: transform .3s ease .18s; }
      #spire        { transform-origin: 50% 100%; transform: translateY(10px) scale(.85); transition: transform .35s ease .2s; }

      /* Hover state */
      .hover-campanile-container:hover #stem { transform: scaleX(.82) scaleY(1.15) translateY(calc(-1 * var(--lift))); }
      .hover-campanile-container:hover #foot { transform: scaleX(.24) scaleY(.65); }
      .hover-campanile-container:hover #tower { transform: translateY(calc(-1 * var(--lift))); opacity: 1; }
      .hover-campanile-container:hover #belfry,
      .hover-campanile-container:hover #cap   { transform: scaleY(1); }
      .hover-campanile-container:hover #clock { transform: scale(1); }
      .hover-campanile-container:hover #spire { transform: translateY(0) scale(1); }

      /* Tilt polish */
      .glyph-container { transition: transform .6s cubic-bezier(.2,.7,.2,1); }
      .hover-campanile-container:hover .glyph-container { transform: translateY(-4px) rotateY(-8deg) scale(1.03); }

      @media (prefers-reduced-motion: reduce) {
        #stem,#foot,#tower,#belfry,#cap,#clock,#spire,.glyph-container { transition: opacity .25s ease !important; transform: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-hero flex items-center justify-center relative overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-blue-500/5 opacity-30" />
      <div className="absolute inset-0 opacity-[0.015] bg-noise" />

      <div className="max-w-2xl mx-auto px-8 py-20 text-center relative z-10">
        <div className="mb-12 opacity-
