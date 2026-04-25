"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase, Certificate } from "@/lib/supabase";

gsap.registerPlugin(ScrollTrigger);

  // Removed hardcoded CATEGORIES. We will compute them dynamically.

// Fallback certificates if Supabase is not configured
const fallbackCertificates: Certificate[] = [
  { id: "1", title: "AI Fluency for Students", issuer: "AI Fluency", category: "other", date_earned: "2026-04", credential_url: "/vault/AI Fluency for students.pdf", image_url: null, description: "AI Fluency framework", created_at: "", updated_at: "" },
  { id: "2", title: "Claude with amazon bedrock", issuer: "Anthropic", category: "other", date_earned: "2026-04", credential_url: "/vault/certificate-vkm9uw4k2894-1777092299.pdf", image_url: null, description: "Instructional Methods", created_at: "", updated_at: "" },
  { id: "3", title: "MCP Advanced Topics", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/vault/mcp advanced topics.pdf", image_url: null, description: "Advanced Protocol Specs", created_at: "", updated_at: "" },
  { id: "4", title: "Claude with the Anthropic API", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/vault/Claude with the Anthropic API.pdf", image_url: null, description: "Anthropic Architecture", created_at: "", updated_at: "" },
  { id: "5", title: "Framework & Foundations", issuer: "AI Fluency", category: "other", date_earned: "2026-04", credential_url: "/vault/Framework & Foundations of ai fluency.pdf", image_url: null, description: "Foundations", created_at: "", updated_at: "" },
  { id: "6", title: "Introduction to Claude Cowork", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/vault/Introduction to Claude Cowork.pdf", image_url: null, description: "Claude Cowork", created_at: "", updated_at: "" },
  { id: "7", title: "AI Fluency for Educators", issuer: "AI Fluency", category: "other", date_earned: "2026-04", credential_url: "/vault/ai fluency for educators.pdf", image_url: null, description: "Education", created_at: "", updated_at: "" },
  { id: "8", title: "AI Fluency for Non Profit", issuer: "AI Fluency", category: "other", date_earned: "2026-04", credential_url: "/vault/ai fluency for non profit.pdf", image_url: null, description: "Non Profit Tech", created_at: "", updated_at: "" },
  { id: "9", title: "Anthropic Certification", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/vault/certificate-3vn8ztec2ege-1776608748.pdf", image_url: null, description: "Anthropic Certification", created_at: "", updated_at: "" },
  { id: "10", title: "Claude 101", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/vault/claude 101.pdf", image_url: null, description: "Core concepts", created_at: "", updated_at: "" },
  { id: "11", title: "Claude Code in Action", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/vault/clause code in action.pdf", image_url: null, description: "Practical coding", created_at: "", updated_at: "" },
  { id: "12", title: "Intro to Sub Agents", issuer: "Anthropic", category: "other", date_earned: "2026-04", credential_url: "/vault/into to sub agents.pdf", image_url: null, description: "Multi-agent systems", created_at: "", updated_at: "" },
  { id: "13", title: "Intro to MCP", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/vault/intro to mcp.pdf", image_url: null, description: "Model Context Protocol", created_at: "", updated_at: "" },
  { id: "14", title: "Teaching the AI Fluency", issuer: "Anthropic", category: "other", date_earned: "2026-04", credential_url: "/vault/teaching the ai fluency framework.pdf", image_url: null, description: "Instructional Methods", created_at: "", updated_at: "" },
  { id: "15", title: "Claude Code 101", issuer: "Anthropic", category: "anthropic", date_earned: "2026-04", credential_url: "/vault/Claude Code 101.pdf", image_url: null, description: "Anthropic Claude Certification", created_at: "", updated_at: "" },
];

export default function CertificatesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loaded, setLoaded] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    const mql = window.matchMedia("(max-width: 768px)");
    setIsMobile(mql.matches);
    const cb = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  }, []);

  // ─── Fetch from Supabase ─────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("certificates")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          setCertificates(data as Certificate[]);
        } else {
          setCertificates(fallbackCertificates);
        }
      } catch {
        console.warn("Supabase fetch failed, using fallback certificates");
        setCertificates(fallbackCertificates);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // ─── GSAP animations ────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".cert-card");
      if (cards) {
        gsap.fromTo(cards,
          { opacity: 0, y: 40, scale: 0.95, filter: "blur(4px)" },
          {
            opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
            duration: 0.8, stagger: 0.06, ease: "power3.out",
            scrollTrigger: { trigger: cards[0], start: "top 85%" },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [loaded, activeFilter]);

  // ─── Dynamic Top-4 Issuer Calculation ────────────────────────────────
  const sortedIssuers = Object.entries(
    certificates.reduce((acc, c) => {
      acc[c.issuer] = (acc[c.issuer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  const top4Issuers = sortedIssuers.slice(0, 4).map((e) => e[0]);

  const DYNAMIC_CATEGORIES = [
    { key: "all", label: "ALL" },
    ...top4Issuers.map((i) => ({ key: i, label: i.toUpperCase() })),
    ...(sortedIssuers.length > 4 ? [{ key: "other", label: "OTHER" }] : []),
  ];

  const filtered =
    activeFilter === "all"
      ? certificates
      : activeFilter === "other"
      ? certificates.filter((c) => !top4Issuers.includes(c.issuer))
      : certificates.filter((c) => c.issuer === activeFilter);

  const getIssuerColor = (issuer: string) => {
    if (issuer.toLowerCase().includes("anthropic")) return "#D4A574";
    if (issuer.toLowerCase().includes("google")) return "#4285F4";
    if (issuer.toLowerCase().includes("deeplearning")) return "#059669";
    if (issuer.toLowerCase().includes("ai fluency")) return "#818cf8";
    return "#C9A96E";
  };

  return (
    <section id="credentials" ref={sectionRef} style={{
      background: "#0a0a0a", position: "relative",
      padding: "120px 0", overflow: "hidden",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", width: "60%", height: "40%",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(201,169,110,0.04) 0%, transparent 70%)",
        top: "20%", left: "20%",
      }} />

      <div className="section-pad-x" style={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            fontFamily: "monospace", fontSize: 9, letterSpacing: "0.28em",
            color: "rgba(255,255,255,0.35)", marginBottom: 16,
          }}>
            <span style={{ color: "#C9A96E", fontWeight: 700 }}>04</span>
            <span style={{ width: 28, height: 1, background: "#C9A96E", opacity: 0.5, display: "inline-block" }} />
            <span>CERTIFICATIONS</span>
          </div>

          <h2 style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontSize: "clamp(36px, 7vw, 72px)",
            fontWeight: 700, color: "white",
            lineHeight: 0.95, letterSpacing: "-0.03em",
          }}>
            Certified<br />
            <em style={{ fontWeight: 400, color: "#C9A96E" }}>Excellence.</em>
          </h2>

          <p style={{
            marginTop: 16, fontFamily: "monospace", fontSize: 12,
            color: "rgba(255,255,255,0.4)", maxWidth: 400, lineHeight: 1.8,
          }}>
            {certificates.length} certifications from Anthropic, Google, and others.
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{
          display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap",
        }}>
          {DYNAMIC_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              style={{
                padding: "8px 20px", borderRadius: 20,
                border: `1px solid ${activeFilter === cat.key ? "#C9A96E" : "rgba(255,255,255,0.1)"}`,
                background: activeFilter === cat.key ? "rgba(201,169,110,0.15)" : "rgba(255,255,255,0.02)",
                color: activeFilter === cat.key ? "#C9A96E" : "rgba(255,255,255,0.5)",
                fontFamily: "monospace", fontSize: 10, letterSpacing: "0.15em",
                textTransform: "uppercase", cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              {cat.label} ({cat.key === "all" ? certificates.length : cat.key === "other" ? certificates.filter(c => !top4Issuers.includes(c.issuer)).length : certificates.filter(c => c.issuer === cat.key).length})
            </button>
          ))}
        </div>

        {/* Certificate Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}>
          {filtered.slice(0, showAll ? undefined : (isMobile ? 8 : 16)).map((cert) => (
            <div
              key={cert.id}
              className="cert-card"
              onClick={() => cert.credential_url && window.open(cert.credential_url, "_blank")}
              style={{
                background: "rgba(255,255,255,0.02)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12, padding: 24,
                cursor: cert.credential_url ? "pointer" : "default",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                position: "relative", overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.borderColor = "rgba(201,169,110,0.2)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Issuer badge */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                marginBottom: 16,
              }}>
                <span style={{
                  fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em",
                  color: getIssuerColor(cert.issuer), textTransform: "uppercase",
                  fontWeight: 700,
                  background: `${getIssuerColor(cert.issuer)}15`,
                  padding: "4px 10px", borderRadius: 4,
                  border: `1px solid ${getIssuerColor(cert.issuer)}30`,
                }}>{cert.issuer}</span>
                {cert.date_earned && (
                  <span style={{
                    fontFamily: "monospace", fontSize: 9,
                    color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em",
                  }}>{cert.date_earned}</span>
                )}
              </div>

              {/* Live PDF Preview */}
              {cert.credential_url ? (
                <div style={{
                  width: "100%", height: 160, borderRadius: 8,
                  marginBottom: 16, overflow: "hidden",
                  border: `1px solid ${getIssuerColor(cert.issuer)}30`,
                  position: "relative",
                  background: "rgba(0,0,0,0.5)",
                }}>
                  <iframe 
                    src={!origin.includes("localhost") ? `https://docs.google.com/viewer?url=${encodeURIComponent(origin + encodeURI(cert.credential_url))}&embedded=true` : `${encodeURI(cert.credential_url)}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
                    style={{ width: "200%", height: "200%", border: "none", pointerEvents: "none", transform: "scale(0.5)", transformOrigin: "0 0" }} 
                    title={cert.title}
                  />
                  {/* Invisible overlay to catch clicks and trigger the window.open */}
                  <div style={{ position: "absolute", inset: 0, zIndex: 10 }} />
                </div>
              ) : (
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: `linear-gradient(135deg, ${getIssuerColor(cert.issuer)}20, ${getIssuerColor(cert.issuer)}08)`,
                  border: `1px solid ${getIssuerColor(cert.issuer)}20`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 16, fontSize: 18,
                }}>
                  🏆
                </div>
              )}

              <h3 style={{
                fontFamily: "var(--font-syne), sans-serif",
                fontSize: 16, fontWeight: 700,
                color: "rgba(255,255,255,0.9)",
                marginBottom: 8, lineHeight: 1.3,
              }}>{cert.title}</h3>

              {cert.description && (
                <p style={{
                  fontSize: 12, color: "rgba(255,255,255,0.4)",
                  lineHeight: 1.6, fontWeight: 300,
                }}>{cert.description}</p>
              )}

              {cert.credential_url && (
                <div style={{
                  marginTop: 16, fontFamily: "monospace",
                  fontSize: 9, color: "#C9A96E",
                  letterSpacing: "0.15em", textTransform: "uppercase",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span>View Credential</span>
                  <span style={{ fontSize: 12 }}>→</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View All Button */}
        {!showAll && filtered.length > (isMobile ? 8 : 16) && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 48 }}>
            <button
              onClick={() => setShowAll(true)}
              style={{
                background: "transparent",
                color: "#C9A96E",
                border: "1px solid rgba(201,169,110,0.3)",
                padding: "16px 40px",
                borderRadius: 40,
                fontFamily: "monospace",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(201,169,110,0.1)";
                e.currentTarget.style.borderColor = "#C9A96E";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)";
              }}
            >
              VIEW ALL
            </button>
          </div>
        )}
      </div>

      {/* Bottom divider */}
      <div style={{
        position: "absolute", bottom: -1, left: 0, right: 0, height: 72,
        background: "#080808",
        clipPath: "polygon(0 72px, 100% 0, 100% 100%, 0 100%)",
        zIndex: 10,
      }} />
    </section>
  );
}
