"use client";

import { useRef, useEffect, useState } from "react";

// ─── Math utils ─────────────────────────────────────────────────────────
const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
const mapR = (v: number, a: number, b: number, c: number, d: number) => c + (d - c) * clamp((v - a) / (b - a), 0, 1);

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)'/%3E%3C/svg%3E")`;

const ROWS = [
  {
    text: "PYTHON · DART · KOTLIN · FLUTTER · FASTAPI · DJANGO · PYTORCH · LANGCHAIN · DOCKER · K8S · ",
    size: 68, italic: false, prominent: false, weight: 400, speed: -1.5,
  },
  {
    text: "REACT · TYPESCRIPT · TAILWIND · GSAP · TENSORFLOW · SELENIUM · FIGMA · CYTHON · VECTOR DBS · ",
    size: 50, italic: true, prominent: true, weight: 700, speed: 0.85,
  },
  {
    text: "AWS · NEXT.JS · THREE.JS · STABLE DIFFUSION · POSTGRESQL · RAG SYSTEMS · LANGRAPH · GLSL · FIREBASE · ",
    size: 60, italic: false, prominent: false, weight: 400, speed: -1.1,
  },
];

export default function SkillsMarquee() {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let raf: number;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // Calculate offsets based on scroll
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const sectionStart = vh * 7; // approximate position
  const offsets = ROWS.map(r =>
    mapR(scrollY, sectionStart - vh, sectionStart + vh * 2, 0, r.speed * 500)
  );

  return (
    <section style={{
      position: "relative", height: "150vh",
      background: "#080808", overflow: "hidden",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
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

      {/* The three rows */}
      {ROWS.map((row, i) => (
        <div key={i} style={{ overflow: "hidden", width: "100%", padding: "6px 0" }}>
          <div
            ref={el => { rowRefs.current[i] = el; }}
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: row.size,
              fontWeight: row.weight,
              fontStyle: row.italic ? "italic" : "normal",
              color: row.prominent
                ? "rgba(240,235,227,0.96)"
                : "rgba(255,255,255,0.07)",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
              willChange: "transform",
              padding: "0 80px",
              transform: `translateX(${offsets[i]}px)`,
            }}
          >
            {row.text.repeat(5)}
          </div>
        </div>
      ))}

      {/* Speed hints */}
      <div style={{
        position: "absolute", right: 40, bottom: 120,
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
