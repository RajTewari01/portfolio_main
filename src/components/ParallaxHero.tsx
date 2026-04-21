"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// ─── Math utils ────────────────────────────────────────────────────────────
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  outMin + (outMax - outMin) * clamp((value - inMin) / (inMax - inMin), 0, 1);

// ─── Grain SVG ─────────────────────────────────────────────────────────────
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)'/%3E%3C/svg%3E")`;

// Ultra-premium custom generated dark cinematic deep ocean scenery
const IMG_HERO = "/hero_bg.png";

export default function ParallaxHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef1 = useRef<HTMLHeadingElement>(null);
  const textRef2 = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // ─── Parallax scroll listener ─────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ─── GSAP text animations ────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      const splitText1 = textRef1.current?.querySelectorAll(".char-first");
      const splitText2 = textRef2.current?.querySelectorAll(".char-last");

      if (splitText1) {
        tl.fromTo(
          splitText1,
          { y: 80, opacity: 0, filter: "blur(12px)", rotateX: 40 },
          {
            y: 0, opacity: 1, filter: "blur(0px)", rotateX: 0,
            duration: 1.2, stagger: 0.04, ease: "power3.out",
          }
        );
      }

      if (splitText2 && splitText2.length > 0) {
        const typeTl = gsap.timeline({ repeat: -1, delay: 1.5 });
        typeTl.fromTo(
          splitText2,
          { opacity: 0, display: "none" },
          { opacity: 1, display: "inline-block", duration: 0.01, stagger: 0.25, ease: "none" }
        );
        typeTl.to({}, { duration: 2.5 });
        const reversedChars = Array.from(splitText2).reverse();
        typeTl.to(reversedChars, {
          opacity: 0, display: "none", duration: 0.01, stagger: 0.02, ease: "none",
        });
        typeTl.to({}, { duration: 0.3 });
      }

      if (subtextRef.current) {
        const textToType = "Full-Stack Engineer & AI/ML Architect — cloud-native systems, LLM agents, cross-platform apps.";
        subtextRef.current.innerText = "";
        let i = 0;
        const typeWriter = () => {
          if (i < textToType.length && subtextRef.current) {
            const char = textToType.charAt(i);
            subtextRef.current.innerHTML += char === ' ' ? '&nbsp;' : char;
            i++;
            setTimeout(typeWriter, 18);
          }
        };
        tl.add(typeWriter, "-=0.6");
      }
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  // ─── Perspective Sticky calculations ─────────────────────────────────
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const scale = mapRange(scrollY, 0, vh, 1, 0.85);
  const rotateZ = mapRange(scrollY, 0, vh, 0, 15); // Clockwise heavy rotation
  const br = mapRange(scrollY, 0, vh, 0, 32);
  const dim = mapRange(scrollY, 0, vh, 1, 0.5); // Keep it visible but darker
  const opacity = mapRange(scrollY, vh * 0.5, vh * 1.2, 1, 0.2); // Slower fade so it peaks into next page
  const blur = mapRange(scrollY, vh * 0.4, vh, 0, 4); // Subtle blur

  return (
    <div ref={wrapRef} style={{ position: "relative", height: "200vh" }}>
      {/* ── S1: STICKY HERO — shrinks + rotates away ── */}
      <div style={{
        position: "sticky", top: 0, height: "100vh",
        zIndex: 50, background: "transparent",
      }}>
        <div
          ref={heroRef}
          style={{
            width: "100%", height: "100%",
            position: "relative",
            transformOrigin: "50% 50%",
            transform: `scale(${scale}) rotate(${rotateZ}deg) translateY(${scrollY * 0.1}px)`,
            filter: `brightness(${dim}) blur(${blur}px)`,
            opacity: opacity,
            borderRadius: br,
            boxShadow: scrollY > 50 ? "0 40px 100px rgba(0,0,0,0.8)" : "none",
          }}
        >
          {/* Full bleed city image */}
          <img src={IMG_HERO} alt="" style={{
            position: "absolute", inset: "-8% 0",
            width: "100%", height: "116%",
            objectFit: "cover", objectPosition: "center top",
          }} />

          {/* Vignettes */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.8) 100%)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)",
          }} />

          {/* Grain */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: GRAIN, backgroundSize: "240px 240px",
            opacity: 0.12, mixBlendMode: "overlay",
          }} />

          {/* Fine border — desktop only */}
          <div className="hidden md:block" style={{
            position: "absolute", inset: 24,
            border: "1px solid rgba(201,169,110,0.08)",
            borderRadius: 4, pointerEvents: "none",
          }} />

          {/* Top bar removed to prevent overlap with the actual global Navbar.tsx */}

          {/* Hero content */}
          <div className="absolute left-0 right-0 bottom-[10vh] md:bottom-0 px-4 md:px-[52px] pb-4 md:pb-[52px] max-w-[100vw] overflow-hidden">
            <div className="fade-in" style={{
              display: "flex", alignItems: "center", gap: 14,
              marginBottom: 18,
            }}>
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/15 shrink-0" style={{ boxShadow: "0 0 20px rgba(99,102,241,0.15)" }}>
                <Image src="/profile.jpg" alt="Biswadeep Tewari" width={64} height={64} className="object-cover w-full h-full" priority />
              </div>
              <div>
                <p style={{ fontSize: 13, color: "white", fontWeight: 500 }}>Biswadeep Tewari</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                  <div style={{ width: 6, height: 6, background: "#34d399", borderRadius: "50%", boxShadow: "0 0 8px rgba(52,211,153,0.8)" }} />
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "monospace" }}>Available for work</p>
                </div>
              </div>
            </div>

            <h1
              ref={textRef1}
              className="font-playfair text-[clamp(42px,11vw,108px)] font-black text-white leading-[0.88] tracking-[-0.025em] mb-[2px] md:mb-1 flex overflow-hidden fade-in fd2"
            >
              {"BISWADEEP".split("").map((char, i) => (
                <span key={`first-${i}`} className="char-first inline-block">{char}</span>
              ))}
            </h1>
            <h1
              ref={textRef2}
              className="font-playfair text-[clamp(42px,11vw,108px)] font-black leading-[0.88] tracking-[-0.025em] mb-3 md:mb-[30px] flex flex-wrap overflow-hidden"
            >
              {"TEWARI".split("").map((char, i) => (
                <span key={`last-${i}`} className="char-last inline-block opacity-0" style={{ color: "#C9A96E", fontStyle: "italic", fontWeight: 400 }}>{char}</span>
              ))}
              <span className="char-last inline-block opacity-0" style={{ color: "#6366f1" }}>.</span>
              <span className="inline-block cursor-blink ml-1 font-light" style={{ color: "#818cf8" }}>|</span>
            </h1>

            <p
              ref={subtextRef}
              className="fade-in fd3"
              style={{
                color: "rgba(255,255,255,0.9)", fontSize: 14, minHeight: 50,
                width: "100%", maxWidth: 520, boxSizing: "border-box", wordBreak: "break-word",
                fontWeight: 300, lineHeight: 1.7,
                background: "rgba(0,0,0,0.3)", backdropFilter: "blur(12px)",
                padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)",
              }}
            />

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.5 }}
              className="flex flex-wrap items-center gap-[6px] md:gap-3 mt-3 md:mt-6"
            >
              {[
                { href: "https://www.linkedin.com/in/raj-tewari-9a93212a3/", label: "LinkedIn" },
                { href: "https://github.com/RajTewari01", label: "GitHub" },
                { href: "mailto:mericans24@gmail.com", label: "Email" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noreferrer"
                  style={{
                    padding: "8px 20px", borderRadius: 24,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.02)", backdropFilter: "blur(8px)",
                    color: "rgba(255,255,255,0.6)", fontSize: 10,
                    letterSpacing: "0.15em", textTransform: "uppercase",
                    fontFamily: "monospace",
                    transition: "all 0.3s ease",
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
                  {item.label}
                </a>
              ))}
              <a
                href="/hire"
                style={{
                  padding: "8px 20px", borderRadius: 24,
                  border: "1px solid #C9A96E",
                  background: "rgba(201,169,110,0.15)", backdropFilter: "blur(8px)",
                  color: "#C9A96E", fontSize: 10,
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  fontFamily: "monospace", fontWeight: 700,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.background = "rgba(201,169,110,0.3)"; 
                  e.currentTarget.style.boxShadow = "0 0 15px rgba(201,169,110,0.2)";
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.background = "rgba(201,169,110,0.15)"; 
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                🚀 Hire Me
              </a>
              <a
                href="/biswadeep_tewari_cv_placeholder.pdf"
                download="Biswadeep_Tewari_CV.pdf"
                style={{
                  padding: "8px 20px", borderRadius: 24,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.02)", backdropFilter: "blur(8px)",
                  color: "rgba(255,255,255,0.6)", fontSize: 10,
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  fontFamily: "monospace",
                  transition: "all 0.3s ease",
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
                ⬇ Download CV
              </a>
              <a
                href="https://www.buymeacoffee.com/biswadeep"
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "8px 20px", borderRadius: 24,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.02)", backdropFilter: "blur(8px)",
                  color: "rgba(255,255,255,0.6)", fontSize: 10,
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  fontFamily: "monospace", fontWeight: 700,
                  transition: "all 0.3s ease",
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
                ☕ Fund The Build
              </a>
            </motion.div>

            {/* Scroll indicator — hidden on mobile to save space */}
            <div className="fade-in fd4 hidden md:flex" style={{
              alignItems: "center", gap: 10,
              marginTop: 24,
              fontFamily: "monospace", fontSize: 9,
              color: "rgba(255,255,255,0.22)", letterSpacing: "0.2em",
            }}>
              <span>SCROLL TO EXPLORE</span>
              <span style={{ color: "#C9A96E", fontSize: 14 }}>↓</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── S2: SLIDES OVER HERO ── */}
      <div style={{
        position: "relative", height: "100vh",
        background: "#F4EEE4", zIndex: 2, overflow: "hidden",
      }}>
        {/* Diagonal top */}
        <div style={{
          position: "absolute", top: -1, left: 0, right: 0, height: 100,
          background: "#F4EEE4",
          clipPath: "polygon(0 100px, 100% 0, 100% 100%, 0 100%)",
          zIndex: 5,
        }} />

        <div className="flex flex-col md:flex-row" style={{
          height: "100%", alignItems: "center",
        }}>
          {/* Text */}
          <div className="w-full md:w-[55%] pt-[110px] md:pt-[60px]" style={{
            display: "flex", flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "clamp(20px, 5vw, 56px)",
            paddingRight: "clamp(20px, 4vw, 60px)",
            paddingBottom: "clamp(20px, 4vw, 60px)",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              fontFamily: "monospace", fontSize: 9, letterSpacing: "0.28em",
              color: "rgba(0,0,0,0.28)", marginBottom: "clamp(12px, 2vw, 22px)",
            }}>
              <span style={{ color: "#C9A96E", fontWeight: 700 }}>01</span>
              <span style={{ width: 28, height: 1, background: "#C9A96E", opacity: 0.5, display: "inline-block" }} />
              <span>THE ARCHITECT</span>
            </div>

            <h2 style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(26px, 4.5vw, 50px)",
              fontWeight: 700, color: "#1a1a1a",
              lineHeight: 1.05, letterSpacing: "-0.025em",
              marginBottom: "clamp(14px, 3vw, 28px)",
              wordBreak: "break-word",
            }}>
              Building the<br />
              <em style={{ fontWeight: 400 }}>impossible</em><br />
              layer by layer.
            </h2>

            <p style={{
              fontFamily: "monospace", fontSize: "clamp(10px, 1.2vw, 12px)", color: "#666",
              lineHeight: 2, maxWidth: 420,
              borderLeft: "2px solid #C9A96E", paddingLeft: 16,
            }}>
              I operate at the bleeding edge of engineering and creativity.
              Whether it&apos;s orchestrating high-throughput LangChain agent systems,
              deploying centimeter-level computer vision models, or crafting
              60fps cross-platform mobile applications.
            </p>

            {/* Location info */}
            <div style={{
              marginTop: "clamp(16px, 3vw, 32px)", fontFamily: "monospace",
              fontSize: 10, color: "#aaa", letterSpacing: "0.1em",
            }}>
              <span>Location: IND · Lat: 22.5726° N · Lon: 88.3639° E</span>
            </div>
          </div>

          {/* Image — compact on mobile, sidebar on desktop */}
          <div className="w-full md:w-auto mx-4 md:mx-0 mb-4 md:mb-0 rounded-xl md:rounded-none md:rounded-l-xl overflow-hidden relative" style={{
            flex: "0 0 40%",
            maxHeight: "200px",
            boxShadow: "-20px 0 60px rgba(0,0,0,0.12)",
          }}>
            <style>{`
              @media (min-width: 768px) {
                .architect-img-wrap { max-height: none !important; margin: 40px 0 80px !important; }
              }
            `}</style>
            <Image src="/profile.jpg" alt="Biswadeep Tewari" width={800} height={600}
              className="architect-img-wrap"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(135deg, transparent 60%, rgba(0,0,0,0.2))",
            }} />
            <div style={{
              position: "absolute", bottom: 20, left: 20,
              fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.2em", background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(8px)", padding: "6px 10px", borderRadius: 3,
            }}>MAKAUT UNIVERSITY · WEST BENGAL</div>
          </div>
        </div>

        {/* SVG wave bottom */}
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" style={{
          position: "absolute", bottom: -1, left: 0, right: 0,
          width: "100%", height: 90, zIndex: 4,
        }}>
          <path d="M0,0 C240,90 720,0 1440,60 L1440,90 L0,90 Z" fill="#080808" />
        </svg>
      </div>
    </div>
  );
}
