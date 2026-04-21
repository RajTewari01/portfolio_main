"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const IMG_PARALLAX = "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=85&auto=format&fit=crop";

import { supabase, Project } from "@/lib/supabase";

// Fallback projects if DB is empty or unreachable
const fallbackProjects: Project[] = [
  {
    id: "1",
    name: "Spatial Tracer",
    description: "PyTorch & OpenCV based realtime spatial computing module achieving sub-centimeter point tracking accuracy at 60fps.",
    github_url: "https://github.com/RajTewari01/spatial_tracer",
    created_at: "",
  },
  {
    id: "2",
    name: "Portfolio Nexus",
    description: "This very site — Next.js 16, Three.js GLSL shaders, GSAP cinematic animations, and parallax scroll effects.",
    github_url: "https://github.com/RajTewari01",
    created_at: "",
  },
  {
    id: "3",
    name: "Autonoma System",
    description: "Highly robust AI sub-agent orchestration framework leveraging LLMs for automated task resolving and error tracing.",
    github_url: "https://github.com/RajTewari01",
    created_at: "",
  },
  {
    id: "4",
    name: "V-Engine Analytics",
    description: "Enterprise class data visualization suite optimized for VRAM-constrained hardware, built on Cython and Pandas.",
    github_url: "https://github.com/RajTewari01",
    created_at: "",
  },
];

// ─── Math utils ─────────────────────────────────────────────────────────
const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
const mapR = (v: number, a: number, b: number, c: number, d: number) => c + (d - c) * clamp((v - a) / (b - a), 0, 1);

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ─── Fetch from Supabase ─────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          setProjects(data as Project[]);
        } else {
          setProjects(fallbackProjects);
        }
      } catch {
        setProjects(fallbackProjects);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header scale reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { scale: 0.6, opacity: 0.3, filter: "blur(8px)" },
          {
            scale: 1, opacity: 1, filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 90%", end: "top 40%",
              scrub: 1.5,
            },
          }
        );
      }

      // Project cards stagger
      const cards = sectionRef.current?.querySelectorAll(".project-row");
      if (cards) {
        cards.forEach((card, i) => {
          gsap.fromTo(card,
            { opacity: 0, y: 60, x: i % 2 === 0 ? -30 : 30, filter: "blur(6px)", rotateY: i % 2 === 0 ? -3 : 3 },
            {
              opacity: 1, y: 0, x: 0, filter: "blur(0px)", rotateY: 0,
              duration: 1.2, ease: "expo.out",
              scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ─── Parallax background calculation ─────────────────────────────────
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const sectionTop = vh * 4.5; // approximate position
  const bgY = mapR(scrollY, sectionTop - vh, sectionTop + vh * 2, 0, -220);

  return (
    <section id="work" ref={sectionRef} style={{
      position: "relative", minHeight: "150vh",
      background: "#080808", overflow: "hidden",
    }}>
      {/* ── PARALLAX BG IMAGE ── */}
      <div
        ref={bgRef}
        style={{
          position: "absolute", inset: "-18% 0",
          willChange: "transform",
          transform: `translateY(${bgY}px)`,
        }}
      >
        <img src={IMG_PARALLAX} alt="" style={{
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center",
          opacity: 0.12,
        }} />
      </div>

      {/* Warm tint */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 100% 60% at 70% 50%, rgba(201,169,110,0.05), transparent 70%)",
      }} />

      {/* Grain */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.08,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundSize: "220px 220px", pointerEvents: "none",
      }} />

      {/* Content */}
      <div className="section-pad-x" style={{ position: "relative", zIndex: 2, paddingTop: 120, paddingBottom: 120 }}>
        {/* Header */}
        <div style={{ marginBottom: 80 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            fontFamily: "monospace", fontSize: 9, letterSpacing: "0.28em",
            color: "rgba(255,255,255,0.35)", marginBottom: 16,
          }}>
            <span style={{ color: "#C9A96E", fontWeight: 700 }}>03</span>
            <span style={{ width: 28, height: 1, background: "#C9A96E", opacity: 0.5, display: "inline-block" }} />
            <span>SELECTED ARCHIVES</span>
          </div>

          <h2
            ref={headerRef}
            style={{
              fontFamily: "var(--font-syne), sans-serif",
              fontSize: "clamp(48px, 10vw, 100px)",
              fontWeight: 900, letterSpacing: "-0.08em",
              lineHeight: 0.85, textTransform: "uppercase",
              transformOrigin: "left center",
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.9)" }}>Oper</span>
            <span className="gradient-text-accent">ations.</span>
          </h2>

          <p style={{
            marginTop: 24, maxWidth: 480,
            fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.5)",
            lineHeight: 1.8,
          }}>
            Engineering is the art of constraint. These systems represent the intersection of complex high-performance backends and ruthless minimalist frontends.
          </p>
        </div>

        {/* Project List */}
        <div style={{ display: "flex", flexDirection: "column", perspective: 1200 }}>
          {projects.map((p, index) => (
            <a
              key={p.id}
              href={p.github_url}
              target="_blank"
              rel="noreferrer"
              className="project-row"
              style={{
                display: "grid", gridTemplateColumns: "60px 1fr 1fr 48px",
                gap: 24, alignItems: "center",
                padding: "32px 0", position: "relative",
                textDecoration: "none", color: "inherit",
                borderTop: "1px solid rgba(255,255,255,0.04)",
                transition: "all 0.5s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.015)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{
                fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.5)",
                background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
                padding: "6px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)",
              }}>0{index + 1}</span>

              <h3 style={{
                fontFamily: "var(--font-syne), sans-serif",
                fontSize: "clamp(28px, 4.5vw, 52px)",
                fontWeight: 800, letterSpacing: "-0.04em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.85)",
                lineHeight: 0.85, transition: "transform 0.5s",
              }}>{p.name}</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <p style={{
                  fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 300,
                  lineHeight: 1.6,
                  background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)",
                  padding: "12px 16px", borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.05)",
                }}>{p.description}</p>
              </div>

              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 700,
                transition: "all 0.5s", transform: "rotate(-45deg)",
              }}>→</div>
            </a>
          ))}
        </div>
      </div>

      {/* Curved wave bottom */}
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{
        position: "absolute", bottom: -1, left: 0, right: 0,
        width: "100%", height: 90, zIndex: 10,
      }}>
        <path d="M0,45 C600,0 840,90 1440,45 L1440,90 L0,90 Z" fill="#0a0a0a" />
      </svg>
    </section>
  );
}
