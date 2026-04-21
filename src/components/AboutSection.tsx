"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Math utils ────────────────────────────────────────────────────────────
const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
const map = (v: number, a: number, b: number, c: number, d: number) => c + (d - c) * clamp((v - a) / (b - a), 0, 1);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)'/%3E%3C/svg%3E")`;

const skills = [
  { group: "Core Languages", tech: ["Python / Cython", "TypeScript", "Dart / Kotlin", "Java", "SQL"] },
  { group: "Artificial Intelligence", tech: ["PyTorch / TensorFlow", "LangChain / LangGraph", "RAG Systems", "Stable Diffusion"] },
  { group: "Architecture & Ops", tech: ["Docker / Kubernetes", "AWS", "FastAPI / Django", "Vector DBs"] },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ─── GSAP animations ────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Counter animation for stats
      if (statsRef.current) {
        const counters = statsRef.current.querySelectorAll(".stat-number");
        counters.forEach((counter) => {
          const target = parseInt(counter.getAttribute("data-target") || "0");
          gsap.fromTo(
            counter,
            { innerText: "0" },
            {
              innerText: target, duration: 2, ease: "power2.out",
              snap: { innerText: 1 },
              scrollTrigger: { trigger: counter, start: "top 85%" },
            }
          );
        });
      }

      // Skills stagger
      const skillRows = sectionRef.current?.querySelectorAll(".skill-row");
      if (skillRows) {
        gsap.fromTo(
          skillRows,
          { opacity: 0, y: 30, filter: "blur(4px)" },
          {
            opacity: 1, y: 0, filter: "blur(0px)",
            duration: 0.8, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: skillRows[0], start: "top 85%" },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ─── SVG Mask Reveal calculation ─────────────────────────────────────
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  // This section starts after the 200vh hero section
  const sectionStart = vh * 2;
  const raw = map(scrollY, sectionStart - vh * 0.2, sectionStart + vh * 0.8, 0, 1);
  const eased = easeOutCubic(raw);
  const maskR = eased * 160;

  return (
    <section id="about" ref={sectionRef} style={{ position: "relative" }}>
      {/* ═══ EFFECT 2: SVG MASK REVEAL ═══ */}
      <div style={{ position: "relative", height: "150vh", overflow: "hidden" }}>
        {/* Base (seen before reveal) */}
        <div style={{
          position: "absolute", inset: 0,
          background: "#080808",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* Pulsing rings */}
          {[56, 100, 154, 210].map((r, i) => (
            <div key={i} style={{
              position: "absolute",
              width: r, height: r, borderRadius: "50%",
              border: `1px solid rgba(201,169,110,${0.12 - i * 0.025})`,
            }} />
          ))}
          <div style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontSize: "clamp(72px, 16vw, 180px)",
            fontWeight: 900,
            color: "rgba(255,255,255,0.025)",
            letterSpacing: "-0.05em",
            userSelect: "none",
          }}>ABOUT</div>
        </div>

        {/* ── REVEALED LAYER ── */}
        <div
          ref={maskRef}
          style={{
            position: "absolute", inset: 0,
            clipPath: `circle(${maskR}vmin at 50% 50%)`,
            opacity: map(raw, 0, 0.05, 0, 1),
            willChange: "clip-path, opacity",
          }}
        >
          {/* Background image */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, #0f2540 0%, #1a3d6b 50%, #0A1628 100%)",
          }} />

          {/* Grid */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.07,
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }} />

          {/* Grain */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: GRAIN, backgroundSize: "240px 240px",
            opacity: 0.1, mixBlendMode: "overlay",
          }} />

          {/* Content */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "0 48px", textAlign: "center",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              fontFamily: "monospace", fontSize: 9, letterSpacing: "0.28em",
              color: "rgba(255,255,255,0.35)", marginBottom: 22,
            }}>
              <span style={{ color: "#C9A96E", fontWeight: 700 }}>02</span>
              <span style={{ width: 28, height: 1, background: "#C9A96E", opacity: 0.5, display: "inline-block" }} />
              <span>THE ARCHITECT</span>
            </div>

            <h2 style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(34px, 7vw, 72px)",
              fontWeight: 700, color: "#fff",
              lineHeight: 1.0, letterSpacing: "-0.025em",
              textShadow: "0 4px 48px rgba(0,0,0,0.6)",
              marginBottom: 32,
            }}>
              Building<br />
              <em style={{ fontWeight: 400, color: "#C9A96E" }}>The Future</em><br />
              Layer.
            </h2>

            <p style={{
              fontFamily: "monospace", fontSize: 13, color: "rgba(255,255,255,0.7)",
              maxWidth: 480, lineHeight: 1.8,
              background: "rgba(0,0,0,0.3)", backdropFilter: "blur(12px)",
              padding: "16px 24px", borderRadius: 8,
              border: "1px solid rgba(201,169,110,0.15)",
            }}>
              I operate at the bleeding edge of engineering and creativity.
              Whether it&apos;s orchestrating high-throughput LangChain agent systems,
              deploying centimeter-level computer vision models, or crafting
              60fps cross-platform mobile applications.
            </p>
          </div>
        </div>

        {/* Wave bottom */}
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{
          position: "absolute", bottom: -1, left: 0, right: 0,
          width: "100%", height: 90, zIndex: 10,
        }}>
          <path d="M0,60 C480,0 960,90 1440,30 L1440,90 L0,90 Z" fill="#F4EEE4" />
        </svg>
      </div>

      {/* ═══ SKILLS & STATS SECTION ═══ */}
      <div style={{
        background: "#F4EEE4", position: "relative",
        padding: "80px 0 120px", overflow: "hidden",
      }}>
        <div className="section-pad-x">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            {/* Left: Stats */}
            <div ref={statsRef}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                fontFamily: "monospace", fontSize: 9, letterSpacing: "0.28em",
                color: "rgba(0,0,0,0.28)", marginBottom: 32,
              }}>
                <span style={{ color: "#C9A96E", fontWeight: 700 }}>02</span>
                <span style={{ width: 28, height: 1, background: "#C9A96E", opacity: 0.5, display: "inline-block" }} />
                <span>SYSTEM METRICS</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div style={{
                  background: "rgba(0,0,0,0.04)", borderRadius: 12, padding: 24,
                  border: "1px solid rgba(0,0,0,0.06)",
                }}>
                  <p className="stat-number" data-target="3" style={{
                    fontFamily: "var(--font-syne), sans-serif",
                    fontSize: "clamp(40px, 6vw, 72px)",
                    fontWeight: 900, color: "#1a1a1a", lineHeight: 1,
                  }}>0</p>
                  <span style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, color: "#6366f1" }}>+</span>
                  <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.15em", color: "#888", marginTop: 8, textTransform: "uppercase" }}>Years Active</p>
                </div>
                <div style={{
                  background: "rgba(0,0,0,0.04)", borderRadius: 12, padding: 24,
                  border: "1px solid rgba(0,0,0,0.06)",
                }}>
                  <p className="stat-number" data-target="15" style={{
                    fontFamily: "var(--font-syne), sans-serif",
                    fontSize: "clamp(40px, 6vw, 72px)",
                    fontWeight: 900, color: "#1a1a1a", lineHeight: 1, display: "inline",
                  }}>0</p>
                  <span style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, color: "#22d3ee" }}>+</span>
                  <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.15em", color: "#888", marginTop: 8, textTransform: "uppercase" }}>Systems Shipped</p>
                </div>
              </div>

              {/* Profile image with reveal */}
              <div style={{
                marginTop: 32, borderRadius: 12, overflow: "hidden",
                position: "relative", aspectRatio: "16/9",
              }}>
                <Image src="/profile.jpg" alt="Biswadeep Tewari" width={800} height={450}
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.6)" }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
                }} />
                <div style={{
                  position: "absolute", bottom: 16, left: 16,
                  fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.7)",
                  letterSpacing: "0.15em", textTransform: "uppercase",
                }}>
                  Makaut University · West Bengal, India
                </div>
              </div>
            </div>

            {/* Right: Skills */}
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                fontFamily: "monospace", fontSize: 9, letterSpacing: "0.28em",
                color: "rgba(0,0,0,0.28)", marginBottom: 32,
              }}>
                <span style={{ color: "#C9A96E", fontWeight: 700 }}>02</span>
                <span style={{ width: 28, height: 1, background: "#C9A96E", opacity: 0.5, display: "inline-block" }} />
                <span>SKILLS ONTOLOGY</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {skills.map((s, i) => (
                  <div key={i} className="skill-row" style={{
                    display: "flex", flexDirection: "column", gap: 8,
                    borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "20px 0",
                  }}>
                    <span style={{
                      fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em",
                      color: "#888", textTransform: "uppercase",
                      background: "rgba(0,0,0,0.04)", padding: "4px 10px",
                      borderRadius: 4, width: "fit-content",
                    }}>{s.group}</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
                      {s.tech.map((tech, j) => (
                        <span key={j} style={{
                          fontSize: 14, fontWeight: 300, color: "#444",
                          cursor: "default", transition: "all 0.3s",
                        }}>{tech}{j !== s.tech.length - 1 ? <span style={{ color: "#ddd", marginLeft: 16 }}>/</span> : ""}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Motto */}
              <div style={{
                marginTop: 32, fontFamily: "monospace", fontSize: 11,
                color: "#C9A96E", letterSpacing: "0.15em", textTransform: "uppercase",
                background: "rgba(201,169,110,0.08)", padding: "12px 16px",
                borderRadius: 8, border: "1px solid rgba(201,169,110,0.15)",
              }}>
                [ Build → Ship → Learn → Repeat ]
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider to next section */}
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{
          position: "absolute", bottom: -1, left: 0, right: 0,
          width: "100%", height: 90, zIndex: 10,
        }}>
          <path d="M0,30 C360,90 1080,0 1440,60 L1440,90 L0,90 Z" fill="#080808" />
        </svg>
      </div>
    </section>
  );
}
