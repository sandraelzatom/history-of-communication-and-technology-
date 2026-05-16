"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";

// ── Era data ──────────────────────────────────────────────────────────────────
const eras = [
  {
    id: "01",
    title: "The Telegraph Age",
    year: "1837",
    yearEnd: "1900",
    medium: "Morse · Wire · Code",
    artifact: "Morse-Vail Telegraph Key",
    source: "Smithsonian Institution",
    symbol: "—·—·",
    bg: "#F2EAD8",
    border: "#0D0D0D",
    borderWidth: "3px",
    accent: "#8B3A2A",
    textPrimary: "#1A0F08",
    textSecondary: "#4A3728",
    fontWeight: "900",
    letterSpacing: "-0.01em",
    hasTexture: true,
    isTypewriter: true,
    isHero: false,
    description:
      "Electricity collapsed distance. For the first time, a message could outrun a horse — crossing continents in seconds through copper nerves buried beneath ocean floors. Samuel Morse's dots and dashes became the first digital language.",
    significance: "Beginning of real-time long-distance communication.",
  },
  {
    id: "02",
    title: "The Vocal Era",
    year: "1876",
    yearEnd: "1950",
    medium: "Bell · Circuit · Voice",
    artifact: "Bell's First Telephone Patent",
    source: "National Archives",
    symbol: "☏",
    bg: "#F5F0E0",
    border: "#0D0D0D",
    borderWidth: "2.5px",
    accent: "#1B3A6B",
    textPrimary: "#0D1B2A",
    textSecondary: "#2C4A6E",
    fontWeight: "800",
    letterSpacing: "-0.01em",
    hasTexture: false,
    isTypewriter: false,
    isHero: false,
    description:
      "Sound became portable. The human voice, stripped to electrical impulse, traveled down copper wire into another ear miles away. Bell's 1876 patent — scrawled hours before a rival arrived — marks the shift from coded pulse to human presence.",
    significance: "Shift from coded pulses (Morse) to transmission of the human voice.",
  },
  {
    id: "03",
    title: "The Wireless Era",
    year: "1901",
    yearEnd: "1980",
    medium: "Hertz · Wave · Ether",
    artifact: "Transatlantic Telegraph Cable",
    source: "Wikipedia — Historical Context",
    symbol: "~∿~",
    bg: "#F8F5EE",
    border: "#0D0D0D",
    borderWidth: "2px",
    accent: "#C17B00",
    textPrimary: "#1C1208",
    textSecondary: "#5C4A20",
    fontWeight: "700",
    letterSpacing: "0em",
    hasTexture: false,
    isTypewriter: false,
    isHero: false,
    description:
      "Invisible waves carrying voices, music, and war bulletins poured from towers into living rooms — binding strangers into a shared present. The transatlantic cable's 27,000 km of copper wire proved that no ocean was too wide.",
    significance: "Massive physical infrastructure required to connect the world globally.",
  },
  {
    id: "04",
    title: "The Digital Packet",
    year: "1983",
    yearEnd: "Now",
    medium: "TCP/IP · Bit · Protocol",
    artifact: "Motorola DynaTAC 8000X",
    source: "Motorola — Product Media",
    symbol: "01",
    bg: "#FAFAFA",
    border: "#0D0D0D",
    borderWidth: "1px",
    accent: "#D7263D",
    textPrimary: "#0D0D0D",
    textSecondary: "#555555",
    fontWeight: "400",
    letterSpacing: "0.02em",
    hasTexture: false,
    isTypewriter: false,
    isHero: true,
    description:
      "Messages atomized into packets, routed around damage, reassembled at the other end. The DynaTAC — $3,995, one hour of talk time — liberated the call from the wall. Communication became untethered, personal, everywhere.",
    significance: "Transition from place-to-place communication to person-to-person communication.",
  },
];

type Era = (typeof eras)[0];

// ── Signal Pulse ──────────────────────────────────────────────────────────────
function SignalPulse() {
  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden z-0">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            borderColor: i % 2 === 0 ? "#D7263D" : "#1B3A6B",
            borderWidth: "1px",
          }}
          initial={{ width: 0, height: 0, opacity: 0.6 }}
          animate={{ width: "180vmax", height: "180vmax", opacity: 0 }}
          transition={{
            duration: 4,
            delay: i * 1,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 4,
          }}
        />
      ))}
      <motion.div
        className="absolute w-2 h-2 rounded-full"
        style={{ background: "#F7B731" }}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.6, 1] }}
        transition={{ duration: 0.7, delay: 0.3 }}
      />
    </div>
  );
}

// ── Typewriter hook ───────────────────────────────────────────────────────────
function useTypewriter(text: string, active: boolean, speed = 22) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) return;
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [active, text, speed]);

  return { displayed, done };
}

// ── Paper texture ─────────────────────────────────────────────────────────────
function PaperTexture() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

// ── Timeline Spine ────────────────────────────────────────────────────────────
function TimelineSpine({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="hidden lg:flex flex-col items-center sticky top-0 h-screen z-20 py-16 justify-center">
      <div
        className="relative flex flex-col items-center"
        style={{ height: "70vh" }}
      >
        {/* Track */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
          style={{ background: "rgba(13,13,13,0.15)" }}
        />
        {/* Lit fill */}
        <motion.div
          className="absolute left-1/2 top-0 w-px -translate-x-1/2 origin-top"
          style={{
            background: "linear-gradient(to bottom, #D7263D, #F7B731)",
            boxShadow: "0 0 6px rgba(215,38,61,0.5)",
          }}
          animate={{ height: `${((activeIndex + 1) / eras.length) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        {/* Nodes */}
        {eras.map((era, i) => (
          <div
            key={era.id}
            className="absolute flex items-center gap-3"
            style={{
              top: `${(i / (eras.length - 1)) * 100}%`,
              transform: "translateY(-50%)",
            }}
          >
            <motion.div
              className="w-3 h-3 rounded-full border-2 flex-shrink-0 relative z-10"
              style={{
                borderColor:
                  i <= activeIndex ? era.accent : "rgba(13,13,13,0.25)",
                background: i <= activeIndex ? era.accent : "white",
                boxShadow:
                  i === activeIndex ? `0 0 10px ${era.accent}` : "none",
              }}
              animate={{ scale: i === activeIndex ? 1.4 : 1 }}
              transition={{ duration: 0.3 }}
            />
            <div style={{ minWidth: "90px" }}>
              <div
                style={{
                  color:
                    i <= activeIndex ? era.accent : "rgba(13,13,13,0.3)",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "9px",
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {era.year}
              </div>
              <div
                style={{
                  color: i <= activeIndex ? "#0D0D0D" : "rgba(13,13,13,0.3)",
                  fontSize: "10px",
                  fontWeight: 700,
                  lineHeight: 1.3,
                }}
              >
                {era.title.replace("The ", "")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Era Card ──────────────────────────────────────────────────────────────────
function EraCard({
  era,
  index,
  onVisible,
}: {
  era: Era;
  index: number;
  onVisible: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-30% 0px -30% 0px" });
  const entryInView = useInView(ref, { once: true, margin: "-100px" });
  const { displayed, done } = useTypewriter(
    era.description,
    era.isTypewriter ? inView : false
  );

  useEffect(() => {
    if (inView) onVisible(index);
  }, [inView, index, onVisible]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 40 }}
      animate={entryInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="relative overflow-hidden"
      style={{ background: era.bg }}
    >
      {era.hasTexture && <PaperTexture />}

      {/* Digital grid overlay */}
      {era.isHero && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#0D0D0D 1px, transparent 1px), linear-gradient(90deg, #0D0D0D 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      )}

      {/* Accent top bar — thinner each era */}
      <div
        style={{
          height:
            era.id === "01"
              ? "6px"
              : era.id === "02"
              ? "5px"
              : era.id === "03"
              ? "4px"
              : "2px",
          background: era.accent,
        }}
      />

      {/* Card header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: `${era.borderWidth} solid ${era.border}` }}
      >
        <div className="flex items-center gap-4">
          <span
            style={{
              color: era.accent,
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              fontWeight: 900,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Object {era.id}
          </span>
          <span
            style={{
              background: era.accent,
              color: "#F5F0E8",
              fontSize: "11px",
              letterSpacing: "0.1em",
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              padding: "2px 12px",
            }}
          >
            {era.year} — {era.yearEnd}
          </span>
        </div>
        <motion.span
          style={{ color: era.accent, fontFamily: "monospace", fontSize: "1.25rem", fontWeight: 900 }}
          animate={inView ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.4 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {era.symbol}
        </motion.span>
      </div>

      {/* Card body */}
      <div className={`p-6 ${era.isHero ? "lg:grid lg:grid-cols-5 lg:gap-8" : ""}`}>
        {/* Left / main content */}
        <div className={era.isHero ? "lg:col-span-3" : ""}>
          <h2
            className="uppercase leading-none mb-4"
            style={{
              fontSize: era.isHero
                ? "clamp(1.8rem, 4vw, 3rem)"
                : "clamp(1.5rem, 3vw, 2.2rem)",
              fontWeight: era.fontWeight,
              color: era.textPrimary,
              letterSpacing: era.letterSpacing,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {era.title}
          </h2>

          {/* Description — typewriter or static */}
          <div
            className="mb-5 leading-relaxed relative"
            style={{
              color: era.textSecondary,
              fontFamily: era.isTypewriter
                ? "'Space Mono', monospace"
                : "'DM Sans', sans-serif",
              fontSize: era.isTypewriter ? "13px" : "14px",
              minHeight: era.isTypewriter ? "5em" : undefined,
            }}
          >
            {era.isTypewriter ? (
              <>
                {displayed}
                {!done && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    style={{
                      display: "inline-block",
                      width: "1px",
                      height: "1em",
                      background: era.accent,
                      marginLeft: "1px",
                      verticalAlign: "middle",
                    }}
                  />
                )}
              </>
            ) : (
              era.description
            )}
          </div>

          {/* Medium tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {era.medium.split(" · ").map((m) => (
              <span
                key={m}
                style={{
                  border: `${era.borderWidth} solid ${era.accent}`,
                  color: era.accent,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  padding: "2px 8px",
                }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Right / artifact info */}
        <div
          className={
            era.isHero
              ? "lg:col-span-2 lg:pl-8 flex flex-col justify-center"
              : "border-t pt-4 mt-2"
          }
          style={{
            borderColor: era.border,
            borderLeftWidth: era.isHero ? "1px" : undefined,
            borderLeftStyle: era.isHero ? "solid" : undefined,
          }}
        >
          <div
            style={{
              color: era.accent,
              fontFamily: "'Space Mono', monospace",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}
          >
            Primary Source
          </div>
          <div
            style={{
              color: era.textPrimary,
              fontSize: era.isHero ? "1.1rem" : "0.9rem",
              fontWeight: 900,
              marginBottom: "4px",
            }}
          >
            {era.artifact}
          </div>
          <div
            style={{
              color: era.textSecondary,
              fontFamily: "'Space Mono', monospace",
              fontSize: "11px",
            }}
          >
            {era.source}
          </div>

          {/* Significance */}
          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              background: era.hasTexture
                ? "rgba(139,58,42,0.07)"
                : era.isHero
                ? "rgba(215,38,61,0.05)"
                : "rgba(13,13,13,0.04)",
              borderLeft: `3px solid ${era.accent}`,
            }}
          >
            <div
              style={{
                color: era.accent,
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                fontWeight: 700,
                marginBottom: "4px",
              }}
            >
              Significance
            </div>
            <p style={{ color: era.textSecondary, fontSize: "12px", lineHeight: 1.6 }}>
              {era.significance}
            </p>
          </div>

          {/* Digital era bar chart */}
          {era.isHero && (
            <div className="mt-6 flex items-center gap-3">
              <span
                style={{
                  color: "#999",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "11px",
                }}
              >
                Mass of communication
              </span>
              <div className="flex items-end gap-0.5">
                {[20, 14, 8, 2].map((h, i) => (
                  <motion.div
                    key={i}
                    style={{
                      width: "6px",
                      background:
                        i === 3
                          ? "#D7263D"
                          : `rgba(215,38,61,${0.2 + i * 0.15})`,
                    }}
                    initial={{ height: 0 }}
                    animate={entryInView ? { height: h } : { height: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Root component ────────────────────────────────────────────────────────────
export default function MuseumJourneyPage() {
  const [activeEra, setActiveEra] = useState(0);
  const handleVisible = useCallback((i: number) => setActiveEra(i), []);

  return (
    <div
      className="relative min-h-screen"
      style={{ background: "#F5F0E8", color: "#0D0D0D", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap');
      `}</style>

      <SignalPulse />

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-30 flex items-stretch border-b-4 border-black"
        style={{ background: "#0D0D0D" }}
      >
        <div
          className="flex items-center px-6 py-4 border-r-4 border-black"
          style={{ background: "#D7263D" }}
        >
          <span className="text-white font-black text-xs tracking-widest uppercase leading-snug">
            Museum of
            <br />
            Communication
          </span>
        </div>
        <div className="flex items-center px-6">
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: "#F7B731" }}
          >
            The Distance Defeaters
          </span>
        </div>
        <div className="flex items-center ml-auto">
          {["Collection", "Archive", "Visit"].map((label) => (
            <a
              key={label}
              href="#"
              className="px-5 py-5 text-xs font-bold tracking-widest uppercase"
              style={{ color: "#F5F0E8", borderLeft: "1px solid #333" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#D7263D")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {label}
            </a>
          ))}
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative z-10 border-b-4 border-black grid"
        style={{ gridTemplateColumns: "1fr 1fr", minHeight: "50vh" }}
      >
        <div className="flex flex-col justify-end p-10 border-r-4 border-black gap-3">
          <div
            className="text-xs font-black tracking-widest uppercase mb-1"
            style={{ color: "#D7263D", fontFamily: "'Space Mono', monospace" }}
          >
            Permanent Collection · 2024
          </div>
          <h1
            className="font-black uppercase leading-none"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.025em" }}
          >
            Signals
            <br />
            <span style={{ color: "#1B3A6B" }}>Across</span>
            <br />
            Time
          </h1>
          <p className="text-sm leading-relaxed max-w-xs mt-2" style={{ color: "#555" }}>
            Four pivotal epochs in the history of human communication — from
            electric wire to digital packet. Scroll to travel the signal.
          </p>
        </div>
        <div className="relative overflow-hidden" style={{ background: "#1B3A6B" }}>
          <div
            className="absolute"
            style={{
              width: "110%",
              paddingBottom: "110%",
              borderRadius: "50%",
              background: "#F7B731",
              top: "-25%",
              left: "-25%",
              opacity: 0.15,
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{ height: "20px", background: "#D7263D" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-black text-white"
              style={{
                fontSize: "clamp(5rem, 16vw, 14rem)",
                fontFamily: "'Space Mono', monospace",
                opacity: 0.15,
              }}
            >
              04
            </span>
          </div>
          <div className="absolute bottom-10 right-8 text-right">
            <span className="font-mono font-bold text-white text-xs tracking-widest opacity-70">
              ERAS
              <br />
              OF SIGNAL
            </span>
          </div>
        </div>
      </motion.header>

      {/* Section label bar */}
      <div
        className="relative z-10 flex items-center border-b-4 border-black"
        style={{ background: "#F7B731" }}
      >
        <div className="px-8 py-3 border-r-4 border-black">
          <span
            className="font-black text-xs tracking-widest uppercase"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            The Journey
          </span>
        </div>
        <div className="px-8 py-3">
          <span className="font-mono text-xs">
            §01 — Chronological Exhibit · Scroll to Advance the Signal
          </span>
        </div>
        <div className="ml-auto px-8 py-3 flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: "#0D0D0D" }}
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="font-mono text-xs">Live Signal</span>
        </div>
      </div>

      {/* Main: Timeline + Cards */}
      <div
        className="relative z-10 lg:grid"
        style={{ gridTemplateColumns: "180px 1fr" }}
      >
        <div className="hidden lg:block">
          <TimelineSpine activeIndex={activeEra} />
        </div>
        <div className="border-l-4 border-black">
          {eras.map((era, i) => (
            <div
              key={era.id}
              style={{
                borderBottom:
                  i < eras.length - 1 ? "4px solid #0D0D0D" : undefined,
              }}
            >
              <EraCard era={era} index={i} onVisible={handleVisible} />
            </div>
          ))}
        </div>
      </div>

      {/* Closing statement */}
      <motion.div
        className="relative z-10 border-t-4 border-black p-12 text-center"
        style={{ background: "#0D0D0D" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div
          className="text-xs font-black tracking-widest uppercase mb-4"
          style={{ color: "#D7263D", fontFamily: "'Space Mono', monospace" }}
        >
          The Distance Defeaters · Thesis
        </div>
        <p
          className="text-lg font-bold max-w-2xl mx-auto leading-relaxed"
          style={{ color: "#F5F0E8" }}
        >
          From 1837 to today, every leap in communication technology has had one
          purpose:{" "}
          <span style={{ color: "#F7B731" }}>to make distance irrelevant.</span>{" "}
          The signal always found a way through.
        </p>
        <div className="flex justify-center gap-2 mt-8">
          {["#D7263D", "#1B3A6B", "#F7B731"].map((c) => (
            <div key={c} className="w-5 h-5" style={{ background: c }} />
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <footer
        className="relative z-10 flex items-center justify-between px-10 py-4 border-t-4 border-black"
        style={{ background: "#0D0D0D", color: "#F5F0E8" }}
      >
        <span
          className="text-xs font-bold tracking-widest uppercase opacity-50"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          Museum of Communication · Est. 2024
        </span>
        <span className="text-xs font-mono opacity-40">
          sandraelzatom / history-of-communication
        </span>
      </footer>
    </div>
  );
}
