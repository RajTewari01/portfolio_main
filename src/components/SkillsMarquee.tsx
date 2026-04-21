"use client";

import { useRef, useEffect, useState } from "react";

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)'/%3E%3C/svg%3E")`;

const ROWS = [
  {
    text: "PYTHON · DART · KOTLIN · FLUTTER · FASTAPI · DJANGO · PYTORCH · LANGCHAIN · DOCKER · K8S · ",
    size: 68, mobilSize: 36, italic: false, prominent: false, weight: 400, speed: 35, reverse: true,
  },
  {
    text: "REACT · TYPESCRIPT · TAILWIND · GSAP · TENSORFLOW · SELENIUM · FIGMA · CYTHON · VECTOR DBS · ",
    size: 50, mobilSize: 28, italic: true, prominent: true, weight: 700, speed: 25, reverse: false,
  },
  {
    text: "AWS · NEXT.JS · THREE.JS · STABLE DIFFUSION · POSTGRESQL · RAG SYSTEMS · LANGRAPH · GLSL · FIREBASE · ",
    size: 60, mobilSize: 32, italic: false, prominent: false, weight: 400, speed: 30, reverse: true,
  },
];

export default function SkillsMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Use IntersectionObserver to trigger animation only when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative", minHeight: "80vh",
        background: "#080808", overflow: "hidden",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "80px 0",
      }}
    >
      {/* CSS keyframes for infinite marquee */}
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* Grain */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: GRAIN, backgroundSize: "220px 220px",
        opacity: 0.13, pointerEvents: "none",
      }} />

      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        width: "70%", height: "40%",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(201,169,110,0.04) 0%, transparent 70%)",
        top: "30%", left: "15%",
      }} />

      {/* Label */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        fontFamily: "monospace", fontSize: 9, letterSpacing: "0.28em",
        color: "rgba(255,255,255,0.35)", marginBottom: 48,
        position: "relative",
      }}>
        <span style={{ color: "#C9A96E", fontWeight: 700 }}>05</span>
        <span style={{ width: 28, height: 1, background: "#C9A96E", opacity: 0.5, display: "inline-block" }} />
        <span>TECH STACK</span>
      </div>

      {/* The three rows — pure CSS infinite marquee */}
      {ROWS.map((row, i) => (
        <div key={i} style={{ overflow: "hidden", width: "100%", padding: "6px 0" }}>
          <div
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: `clamp(${row.mobilSize}px, 5vw, ${row.size}px)`,
              fontWeight: row.weight,
              fontStyle: row.italic ? "italic" : "normal",
              color: row.prominent
                ? "rgba(240,235,227,0.96)"
                : "rgba(255,255,255,0.07)",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
              willChange: "transform",
              display: "inline-block",
              animation: isVisible
                ? `${row.reverse ? "marquee-left" : "marquee-right"} ${row.speed}s linear infinite`
                : "none",
            }}
          >
            {/* Duplicate the text so the second copy seamlessly follows the first */}
            {row.text.repeat(6)}{row.text.repeat(6)}
          </div>
        </div>
      ))}

      {/* Speed hints */}
      <div style={{
        position: "absolute", right: 40, bottom: 80,
        display: "flex", flexDirection: "column", gap: 8,
        fontFamily: "monospace",
        fontSize: 8, color: "rgba(255,255,255,0.2)",
        letterSpacing: "0.18em", textAlign: "right",
      }}>
        {["← 1.5×", "→ 0.85×", "← 1.1×"].map((t, i) => (
          <div key={i} style={{ color: i === 1 ? "#C9A96E" : "rgba(255,255,255,0.18)" }}>{t}</div>
        ))}
      </div>

      {/* Bottom wave */}
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{
        position: "absolute", bottom: -1, left: 0, right: 0,
        width: "100%", height: 90, zIndex: 10,
      }}>
        <path d="M0,45 C600,0 840,90 1440,45 L1440,90 L0,90 Z" fill="#080808" />
      </svg>
    </section>
  );
}
