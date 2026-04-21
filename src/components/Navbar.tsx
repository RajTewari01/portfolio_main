"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Credentials", href: "/#credentials" },
  { label: "Contact", href: "/#contact" },
  { label: "Hire", href: "/hire" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: "circOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
          scrolled ? "py-3" : "py-5 bg-transparent"
        }`}
        style={scrolled ? {
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "none",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
        } : undefined}
      >
        {/* Glowing top border on scroll */}
        <div 
          className={`absolute top-0 left-0 w-full h-[1px] transition-opacity duration-700 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: "linear-gradient(90deg, transparent 5%, rgba(201,169,110,0.5) 30%, rgba(201,169,110,0.8) 50%, rgba(201,169,110,0.5) 70%, transparent 95%)" }}
        />

        <div className="px-6 md:px-12 w-full max-w-[1920px] mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <a href="/admin" className="relative group flex items-center gap-4">
             <div className="relative">
               <div className="w-9 h-9 border border-white/20 bg-white/5 backdrop-blur-md text-white font-syne font-bold flex items-center justify-center text-sm rounded-sm group-hover:bg-[#C9A96E] group-hover:border-[#C9A96E] group-hover:text-black transition-all duration-500">
                 BT
               </div>
               <div className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: "0 0 20px rgba(201,169,110,0.4)" }} />
             </div>
             <div className="flex flex-col opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
               <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/50 leading-none mb-1">
                 System
               </span>
               <span className="font-syne font-bold tracking-[0.1em] text-xs text-[#C9A96E] leading-none">
                 DIGITAL NEXUS
               </span>
             </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10 font-mono text-[10px] uppercase tracking-[0.2em]">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith("/#")) {
                    e.preventDefault();
                    const targetId = link.href.replace("/#", "");
                    const targetEl = document.getElementById(targetId);
                    if (targetEl) {
                      // Fast scroll instead of native smooth taking forever
                      window.scrollTo({ top: targetEl.offsetTop, behavior: "auto" });
                    }
                  }
                }}
                className="relative group py-2 flex items-center gap-2"
              >
                <span className="text-[#C9A96E] opacity-50 group-hover:opacity-100 transition-opacity duration-300">0{i + 1}</span>
                <span className="text-white/40 group-hover:text-white transition-colors duration-300">{link.label}</span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-500 ease-out" />
              </a>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center z-50 mix-blend-difference"
          >
            <span className={`w-full h-px bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-6 h-px bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`w-full h-px bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>
      </motion.nav>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <div className="flex flex-col gap-6 text-center">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: "circOut" }}
                  className="font-playfair text-[clamp(40px,10vw,80px)] font-black uppercase tracking-tighter text-white/90 hover:text-[#C9A96E] hover:italic transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.8 }}
              className="absolute bottom-10 font-mono text-[9px] tracking-[0.4em] uppercase text-white/20"
            >
              Biswadeep Tewari — Portfolio v5.0
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
