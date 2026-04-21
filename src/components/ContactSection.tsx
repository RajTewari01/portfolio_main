"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/raj-tewari-9a93212a3/", color: "#0077b5" },
  { label: "GitHub", href: "https://github.com/RajTewari01", color: "#818cf8" },
  { label: "Credly", href: "https://www.credly.com/users/biswadeep-tewari.e0f04513", color: "#F08D23" },
  { label: "Google Skills", href: "https://www.skills.google/public_profiles/2d5e1957-0650-40f5-8b71-e8b7eabed363", color: "#34A853" },
  { label: "Google Dev", href: "https://g.dev/BiswadeepTewari", color: "#4285F4" },
  { label: "Email", href: "mailto:mericans24@gmail.com", color: "#22d3ee" },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Massive scale reveal
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { scale: 0.3, opacity: 0, filter: "blur(20px)" },
          {
            scale: 1, opacity: 1, filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 90%", end: "top 30%",
              scrub: 2,
            },
          }
        );
      }

      // Link pills
      const pills = sectionRef.current?.querySelectorAll(".link-pill");
      if (pills) {
        gsap.fromTo(pills,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.7, stagger: 0.08, ease: "back.out(2)",
            scrollTrigger: { trigger: pills[0], start: "top 85%" },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} style={{
      position: "relative",
      minHeight: "100vh",
      background: "#080808",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "120px 24px",
      overflow: "hidden",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        width: "80%", height: "60%",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(99,102,241,0.04) 0%, transparent 60%)",
        top: "20%", left: "10%",
      }} />

      {/* Big heading */}
      <h2
        ref={headingRef}
        style={{
          fontFamily: "var(--font-playfair), 'Playfair Display', serif",
          fontSize: "clamp(48px, 14vw, 160px)",
          fontWeight: 900, color: "#fff",
          lineHeight: 0.85, letterSpacing: "-0.06em",
          textAlign: "center", marginBottom: 48,
          transformOrigin: "50% 50%",
        }}
      >
        Join<br />
        <em style={{ fontWeight: 400, color: "#C9A96E" }}>Nexus.</em>
      </h2>

      {/* Subtext */}
      <p style={{
        fontFamily: "monospace", fontSize: 12,
        color: "rgba(255,255,255,0.4)", maxWidth: 400,
        textAlign: "center", lineHeight: 1.8, marginBottom: 40,
      }}>
        Whether you need a high-performance backend, a cinematic frontend,
        or an AI agent integration — let&apos;s discuss your next project.
      </p>

      {/* Link Pills */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 12,
        justifyContent: "center", maxWidth: 600,
      }}>
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("mailto") ? undefined : "_blank"}
            rel="noreferrer"
            className="link-pill"
            style={{
              padding: "12px 32px", borderRadius: 32,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(12px)",
              color: "rgba(255,255,255,0.6)", fontFamily: "monospace",
              fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
              fontWeight: 400, textDecoration: "none",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              display: "flex", alignItems: "center", gap: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(201,169,110,0.15)";
              e.currentTarget.style.borderColor = "#C9A96E";
              e.currentTarget.style.color = "#C9A96E";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
            }}
          >
            {link.label}
            <span style={{ fontSize: 16 }}>↘</span>
          </a>
        ))}
      </div>

      {/* Hire Me CTA */}
      <a
        href="/hire"
        style={{
          marginTop: 48, padding: "16px 40px",
          borderRadius: 40,
          border: "1px solid #C9A96E",
          background: "rgba(201,169,110,0.15)",
          color: "#C9A96E", fontFamily: "var(--font-syne), sans-serif",
          fontSize: 14, fontWeight: 800, letterSpacing: "0.2em",
          textTransform: "uppercase", textDecoration: "none",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          position: "relative", overflow: "hidden",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(201,169,110,0.25)";
          e.currentTarget.style.boxShadow = "0 0 30px rgba(201,169,110,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(201,169,110,0.15)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        CONNECT →
      </a>

      {/* Footer line */}
      <footer style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        borderTop: "1px solid rgba(255,255,255,0.04)",
        padding: "20px 0",
      }}>
        <div className="section-pad-x" style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.15em",
        }}>
          <span>© 2026 BISWADEEP TEWARI</span>
          <span>ENGINEERED WITH ♡ IN KOLKATA</span>
        </div>
      </footer>
    </section>
  );
}
