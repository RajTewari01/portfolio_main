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
  const maskWrapRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [maskP, setMaskP] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    setIsMobile(mql.matches);
    const cb = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  }, []);

  // ─── Scroll-driven mask reveal using element position ─────────────────
  useEffect(() => {
    let raf: number;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!maskWrapRef.current) return;
        const rect = maskWrapRef.current.getBoundingClientRect();
        const vh = window.innerHeight;
        // Progress: 0 when element top hits 80% of viewport,
        //           1 when element top is 20% above viewport top
        const progress = clamp((vh * 0.8 - rect.top) / (vh * 1.0), 0, 1);
        setMaskP(progress);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // initial calculation
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // Circle radius: 0 → 150 vmin (matching parallax-demo reference)
  const maskR = map(maskP, 0, 1, 0, 150);

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

  return (
    <section id="about" ref={sectionRef} style={{ position: "relative" }}>
      {isMobile ? (
        // ─── MOBILE LUXURY LAYOUT ───
        <div style={{ background: "#080808", color: "#fff", paddingTop: 80, paddingBottom: 80, position: "relative", overflow: "hidden" }}>
          {/* Subtle luxurious background accent */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 400,
            background: "radial-gradient(ellipse at top, rgba(201,169,110,0.15) 0%, transparent 70%)",
            pointerEvents: "none"
          }} />
          
          <div className="section-pad-x" style={{ position: "relative", zIndex: 2 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              fontFamily: "monospace", fontSize: 10, letterSpacing: "0.25em",
              color: "rgba(255,255,255,0.4)", marginBottom: 24,
            }}>
              <span style={{ color: "#C9A96E", fontWeight: 700 }}>02</span>
              <span style={{ width: 24, height: 1, background: "#C9A96E", opacity: 0.5, display: "inline-block" }} />
              <span>THE ARCHITECT</span>
            </div>

            <h2 style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "12vw",
              fontWeight: 700, color: "#fff",
              lineHeight: 1.1, letterSpacing: "-0.02em",
              marginBottom: 32,
            }}>
              Building<br />
              <em style={{ fontWeight: 400, color: "#C9A96E" }}>The Future</em><br />
              Layer.
            </h2>

            <p style={{
              fontFamily: "monospace", fontSize: 13, color: "rgba(255,255,255,0.7)",
              lineHeight: 1.8, marginBottom: 48,
              borderLeft: "2px solid #C9A96E", paddingLeft: 16,
            }}>
              I operate at the bleeding edge of engineering and creativity.
              Whether it&apos;s orchestrating high-throughput LangChain agent systems,
              deploying centimeter-level computer vision models, or crafting
              60fps cross-platform mobile applications.
            </p>

            <div style={{
              borderRadius: "16px 16px 0 0", overflow: "hidden",
              position: "relative", aspectRatio: "3/4", marginBottom: 40,
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
            }}>
              <Image src="/profile.jpg" alt="Biswadeep Tewari" fill
                style={{ objectFit: "cover", filter: "grayscale(0.3) contrast(1.1)" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, #080808 0%, transparent 40%)",
              }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 48 }}>
              <div style={{
                background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 20,
                border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <p style={{ fontSize: 36, fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                  3<span style={{ color: "#C9A96E" }}>+</span>
                </p>
                <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em", color: "#888", marginTop: 8, textTransform: "uppercase" }}>Years Active</p>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 20,
                border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <p style={{ fontSize: 36, fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                  15<span style={{ color: "#C9A96E" }}>+</span>
                </p>
                <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em", color: "#888", marginTop: 8, textTransform: "uppercase" }}>Systems Shipped</p>
              </div>
            </div>

            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                fontFamily: "monospace", fontSize: 10, letterSpacing: "0.25em",
                color: "rgba(255,255,255,0.4)", marginBottom: 24,
              }}>
                <span style={{ color: "#C9A96E", fontWeight: 700 }}>SKILLS</span>
                <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {skills.map((s, i) => (
                  <div key={i} style={{ paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{
                      fontFamily: "monospace", fontSize: 10, letterSpacing: "0.15em",
                      color: "#C9A96E", textTransform: "uppercase", display: "block", marginBottom: 12
                    }}>{s.group}</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {s.tech.map((tech, j) => (
                        <span key={j} style={{
                          fontSize: 13, color: "rgba(255,255,255,0.8)",
                          background: "rgba(255,255,255,0.05)", padding: "6px 12px", borderRadius: 20,
                        }}>{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ─── DESKTOP PARALLAX REVEAL LAYOUT ───
        <>
          {/* ═══ EFFECT 2: SVG MASK REVEAL ═══ */}
      <div ref={maskWrapRef} style={{ position: "relative", height: "150vh", overflow: "hidden" }}>
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
            opacity: map(maskP, 0, 0.05, 0, 1),
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
            padding: "0 24px", textAlign: "center",
            width: "100%", boxSizing: "border-box"
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
              width: "100%",
              overflowWrap: "break-word",
              wordWrap: "break-word",
              hyphens: "auto"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
      </>
      )}
    </section>
  );
}
