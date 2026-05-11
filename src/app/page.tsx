"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import ParallaxHero from "@/components/ParallaxHero";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import CertificatesSection from "@/components/CertificatesSection";
import SkillsMarquee from "@/components/SkillsMarquee";
import ContactSection from "@/components/ContactSection";
import CustomCursor from "@/components/CustomCursor";
import { useGame } from "@/components/game/GameContext";

// Three.js canvas — dynamically imported, no SSR
const ThreeCanvas = dynamic(() => import("@/components/ThreeCanvas"), { ssr: false });
const LegacyGameWorld = dynamic(() => import("@/components/game/LegacyGameWorld"), { ssr: false });

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const { isGameMode } = useGame();

  // ─── Lenis smooth scroll ──────────────────────────────────────────────
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenis: any;
    let raf: number;

    (async () => {
      const Lenis = (await import("lenis")).default;
      lenis = new Lenis({
        duration: 0.8,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
      });

      const animate = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
    })();

    return () => {
      cancelAnimationFrame(raf);
      if (lenis) lenis.destroy();
    };
  }, [isGameMode]); // Restart/destroy if game mode changes

  return (
    <>
      {/* Gamified 3D World — perfectly sandboxed vanilla engine */}
      <LegacyGameWorld />

      {/* 3D WebGL background */}
      {!isGameMode && <ThreeCanvas />}

      {/* Global black overlay for depth */}
      {!isGameMode && <div className="fixed inset-0 z-[1] bg-black/30 pointer-events-none" />}

      {/* Custom cursor */}
      {!isGameMode && <CustomCursor />}

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main ref={mainRef} className="relative z-[2]">
        {/* Effect 1: Perspective Sticky Hero */}
        <ParallaxHero />

        {/* Effect 2: SVG Mask Reveal About */}
        <AboutSection />

        {/* Effect 3: Background Parallax Projects */}
        <ProjectsSection />

        {/* Supabase Certificates */}
        <CertificatesSection />

        {/* Effect 4: Text Parallax Skills */}
        <SkillsMarquee />

        {/* Contact & Footer */}
        <ContactSection />
      </main>
    </>
  );
}
