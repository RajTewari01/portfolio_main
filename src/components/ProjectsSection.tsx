"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Old background: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=85&auto=format&fit=crop"
const IMG_PARALLAX = "https://images.unsplash.com/photo-1695659867860-9133ca6fb6b9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

import { supabase, Project } from "@/lib/supabase";

// Fallback projects if DB is empty or unreachable
const fallbackProjects: Project[] = [
  {
    id: "1",
    name: "Spatial Tracer",
    description: "Real-time object tracking with PyTorch and OpenCV. Handles spatial point mapping at 60fps with sub-centimeter precision.",
    github_url: "https://github.com/RajTewari01/spatial_tracer",
    created_at: "",
  },
  {
    id: "2",
    name: "Portfolio",
    description: "This site. Built with Next.js 16, GSAP scroll animations, and parallax effects. Pulls data from Supabase.",
    github_url: "https://github.com/RajTewari01/portfolio",
    created_at: "",
  },
  {
    id: "3",
    name: "LeetCode Grind",
    description: "My DSA solutions — arrays, trees, graphs, DP. Clean implementations with time/space analysis.",
    github_url: "https://github.com/RajTewari01/leetcode",
    created_at: "",
  },
  {
    id: "4",
    name: "Neural Citadel",
    description: "Multi-model AI platform that runs on a 4GB GPU. Uses subprocess isolation to manage VRAM across 12 services and 60+ model of different kinds.",
    github_url: "https://github.com/RajTewari01/neural_citadel",
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
              fontSize: "clamp(36px, 8vw, 100px)",
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
            A few things I've built and shipped. Backend-heavy systems, ML pipelines, and the occasional frontend that doesn't look like it was made in 2012.
          </p>
        </div>

        {/* Project List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0, perspective: 1200 }}>
          {projects.map((p, index) => (
            <a
              key={p.id}
              href={p.github_url}
              target="_blank"
              rel="noreferrer"
              className="project-row grid grid-cols-[40px_1fr_40px] md:grid-cols-[60px_1fr_1fr_60px] gap-x-4 md:gap-x-8 gap-y-3 items-start md:items-center"
              style={{
                padding: "28px 0", position: "relative",
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
                textAlign: "center",
              }}>0{index + 1}</span>

              <h3 className="col-start-2 col-end-3 md:col-start-2 md:col-end-3" style={{
                fontFamily: "var(--font-syne), sans-serif",
                fontSize: "clamp(22px, 4vw, 52px)",
                fontWeight: 800, letterSpacing: "-0.04em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.85)",
                lineHeight: 0.9, transition: "transform 0.5s",
                wordBreak: "break-word",
              }}>{p.name}</h3>

              <p className="col-start-2 col-end-4 md:col-start-3 md:col-end-4" style={{
                fontSize: "clamp(11px, 1.5vw, 13px)", color: "rgba(255,255,255,0.55)", fontWeight: 300,
                lineHeight: 1.7,
                background: "linear-gradient(135deg, rgba(10,10,10,0.7), rgba(20,18,14,0.6))",
                backdropFilter: "blur(12px)",
                padding: "14px 18px", borderRadius: 10,
                border: "1px solid rgba(201,169,110,0.08)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
              }}>{p.description}</p>

              <div className="col-start-3 col-end-4 md:col-start-4 md:col-end-5 justify-self-end" style={{
                width: 36, height: 36, borderRadius: "50%",
                border: "1px solid rgba(201,169,110,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 700, color: "rgba(201,169,110,0.6)",
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
