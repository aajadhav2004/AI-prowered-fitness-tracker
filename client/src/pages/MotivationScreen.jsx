import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
// If you want to use Lottie later, uncomment:
// import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";

/**
 * Ultimate Motivation Screen
 * - Sky-blue gradient background
 * - Floating silhouettes
 * - Rotating + bouncing dumbbell (SVG)
 * - Progress bar (animates to 100% while redirect countdown)
 * - Random quote each time
 * - Optional: plug Lottie JSON (see comments below)
 */

export default function MotivationScreen() {
  const nav = useNavigate();
  const [quote] = useState(() => {
    const quotes = [
      "Push yourself, because no one else will.",
      "The body achieves what the mind believes.", 
      "Small progress is still progress.",
      "Train like a beast, look like a beauty.",
      "Don’t stop until you’re proud.",
      "Success starts with self-discipline.",
      "Consistency creates results.",
      "Sweat is fat crying."
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  });

  // Progress state: animates from 0 -> 100 over durationMs
  const [progress, setProgress] = useState(0);
  const durationMs = 2800; // total screen time
  const frameMs = 50;
  const timerRef = useRef(null);

  // If you later have a Lottie JSON or URL:
  // 1) npm install lottie-react
  // 2) Uncomment import Lottie...
  // 3) Provide animationData prop with JSON or load with fetch and store in state
  // Example placeholder:
  // const [lottieData, setLottieData] = useState(null);
  // useEffect(() => { fetch(YOUR_LOTTIE_URL).then(r=>r.json()).then(setLottieData) }, []);
  // Then render: lottieData ? <Lottie animationData={lottieData} loop /> : <SVG loader />

  useEffect(() => {
    // animate progress
    const steps = Math.ceil(durationMs / frameMs);
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setProgress(Math.min(100, Math.round((i / steps) * 100)));
      if (i >= steps) {
        clearInterval(timerRef.current);
        // navigate when done
        nav("/");
      }
    }, frameMs);

    return () => clearInterval(timerRef.current);
  }, [nav, durationMs, frameMs]);

  // subtle controls for SVG dumbbell animation using framer controls
  const controls = useAnimation();
  useEffect(() => {
    controls.start({
      x: ["-18%", "18%"],
      rotate: [ -6, 6, -6 ],
      transition: {
        x: { repeat: Infinity, repeatType: "reverse", duration: 1.4, ease: "easeInOut" },
        rotate: { repeat: Infinity, repeatType: "reverse", duration: 0.9, ease: "easeInOut" }
      }
    });
  }, [controls]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-white" />

      {/* Faded floating gym silhouettes */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {/* silhouette 1 */}
        <motion.div
          initial={{ y: -40, opacity: 0.14 }}
          animate={{ y: 40 }}
          transition={{ repeat: Infinity, duration: 8, repeatType: "reverse", ease: "linear" }}
          className="absolute left-10 top-20 opacity-20"
          style={{ transformOrigin: "center" }}
        >
          {/* simple weight plate icon (SVG) */}
          <svg width="110" height="110" viewBox="0 0 24 24" fill="none" className="text-white">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.2" opacity="0.18" />
            <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.2" opacity="0.12" />
          </svg>
        </motion.div>

        {/* silhouette 2 */}
        <motion.div
          initial={{ y: 10, opacity: 0.12 }}
          animate={{ y: -30 }}
          transition={{ repeat: Infinity, duration: 10, repeatType: "reverse", ease: "linear", delay: 1 }}
          className="absolute right-8 top-36 opacity-20"
        >
          <svg width="140" height="90" viewBox="0 0 200 120" fill="none">
            {/* treadmill-ish shape */}
            <rect x="10" y="60" width="160" height="18" rx="6" fill="white" opacity="0.08" />
            <rect x="30" y="30" width="12" height="40" rx="3" fill="white" opacity="0.08" />
            <rect x="150" y="20" width="8" height="20" rx="2" fill="white" opacity="0.06" />
          </svg>
        </motion.div>

        {/* silhouette 3 - dumbbell outline */}
        <motion.div
          initial={{ y: -20, opacity: 0.1 }}
          animate={{ y: 30 }}
          transition={{ repeat: Infinity, duration: 12, repeatType: "reverse", ease: "linear", delay: 0.6 }}
          className="absolute left-1/2 -translate-x-1/2 top-6 opacity-20"
        >
          <svg width="200" height="80" viewBox="0 0 200 80" fill="none">
            <rect x="16" y="30" width="30" height="20" rx="4" fill="white" opacity="0.06" />
            <rect x="154" y="30" width="30" height="20" rx="4" fill="white" opacity="0.06" />
            <rect x="60" y="36" width="80" height="8" rx="4" fill="white" opacity="0.06" />
          </svg>
        </motion.div>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl px-6 py-24">
        {/* Quote */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white text-2xl md:text-3xl font-semibold drop-shadow-md"
        >
          {quote}
        </motion.h1>

        {/* Lottie placeholder / SVG loader */}
        <div className="mt-10 flex flex-col items-center">
          {/* If you plug Lottie JSON, render it here (see top comments).
              For now we render the animated SVG dumbbell using Framer Motion */}
          <motion.div animate={controls} className="w-64 h-24 flex items-center justify-center">
            {/* Left weight */}
            <svg width="240" height="80" viewBox="0 0 240 80" fill="none" className="drop-shadow-md">
              {/* left plate */}
              <rect x="6" y="18" width="34" height="44" rx="6" fill="white" />
              <rect x="196" y="18" width="34" height="44" rx="6" fill="white" />
              {/* bar */}
              <rect x="46" y="36" width="148" height="8" rx="4" fill="white" />
              {/* small inner cutouts for realism */}
              <rect x="12" y="26" width="22" height="6" rx="2" fill="rgba(0,0,0,0.06)" />
              <rect x="198" y="26" width="22" height="6" rx="2" fill="rgba(0,0,0,0.06)" />
            </svg>
          </motion.div>

          {/* Progress bar */}
          <div className="w-72 md:w-96 mt-6">
            <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-white/90">
              <span>Preparing your dashboard</span>
              <span>{progress}%</span>
            </div>
          </div>

          {/* small subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-4 text-sm text-white/90"
          >
            Loading — hang tight for a second
          </motion.p>
        </div>
      </div>
    </div>
  );
}
