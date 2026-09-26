import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ANIM_INITIAL = { filter: "blur(10px)", opacity: 0, y: 20 };
const ANIM_TRANSITION = { duration: 0.85, ease: "easeOut" };

function ArrowUpRightIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 17L17 7"></path>
      <path d="M7 7h10v10"></path>
    </svg>
  );
}

function PlayIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <polygon points="6 4 20 12 6 20 6 4"></polygon>
    </svg>
  );
}

function FadingVideo({ src, className, style }) {
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const fadingOutRef = useRef(false);
  const FADE_MS = 500;
  const FADE_OUT_LEAD = 0.55;

  const fadeTo = (targetOpacity, duration = FADE_MS) => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const current = Number.parseFloat(videoEl.style.opacity || "0");
    const startOpacity = Number.isFinite(current) ? current : 0;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const nextOpacity = startOpacity + (targetOpacity - startOpacity) * t;
      videoEl.style.opacity = String(nextOpacity);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return undefined;

    const onLoadedData = () => {
      videoEl.style.opacity = "0";
      videoEl.play().catch(() => { });
      fadeTo(1);
    };

    const onTimeUpdate = () => {
      if (!videoEl.duration || !Number.isFinite(videoEl.duration)) return;
      const remaining = videoEl.duration - videoEl.currentTime;
      if (!fadingOutRef.current && remaining <= FADE_OUT_LEAD && remaining > 0) {
        fadingOutRef.current = true;
        fadeTo(0);
      }
    };

    const onEnded = () => {
      videoEl.style.opacity = "0";
      window.setTimeout(() => {
        videoEl.currentTime = 0;
        videoEl.play().catch(() => { });
        fadingOutRef.current = false;
        fadeTo(1);
      }, 100);
    };

    videoEl.addEventListener("loadeddata", onLoadedData);
    videoEl.addEventListener("timeupdate", onTimeUpdate);
    videoEl.addEventListener("ended", onEnded);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      videoEl.removeEventListener("loadeddata", onLoadedData);
      videoEl.removeEventListener("timeupdate", onTimeUpdate);
      videoEl.removeEventListener("ended", onEnded);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      playsInline
      preload="auto"
      className={className}
      style={{ opacity: 0, ...style }}
    />
  );
}

function BlurText({ text, className }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const words = useMemo(() => text.split(" "), [text]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <p
      ref={containerRef}
      className={className}
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", rowGap: "0.1em" }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={
            isVisible
              ? {
                filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                opacity: [0, 0.5, 1],
                y: [50, -5, 0],
              }
              : { filter: "blur(10px)", opacity: 0, y: 50 }
          }
          transition={{
            duration: 0.7,
            times: [0, 0.5, 1],
            ease: "easeOut",
            delay: (index * 100) / 1000,
          }}
          style={{ display: "inline-block", marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Resume Analysis", href: "/dashboard/analysis/new" },
    { name: "ATS Builder", href: "/dashboard/ats" },
  ];

  return (
    <nav className="fixed inset-x-0 top-6 z-50 flex justify-center px-6">
      <div className="liquid-glass flex items-center gap-2 rounded-full p-1.5 shadow-2xl backdrop-blur-xl border border-white/10">
        <a href="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors ml-1">
          <span className="font-heading text-2xl italic leading-none text-white">i</span>
        </a>
        
        {/* Desktop Menu */}
        <div className="hidden items-center md:flex px-2">
          {links.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="px-4 py-2 text-sm font-medium text-white/80 font-body hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <a
            href="/login"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black whitespace-nowrap transition-transform hover:scale-105 active:scale-95"
          >
            Get Started
            <ArrowUpRightIcon className="h-4 w-4" />
          </a>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full md:hidden text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute inset-x-6 top-20 z-40 md:hidden"
          >
            <div className="liquid-glass-strong rounded-3xl p-6 shadow-2xl backdrop-blur-2xl border border-white/10">
              <div className="flex flex-col gap-4">
                {links.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-xl font-heading italic text-white/90 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="mt-4 border-t border-white/10 pt-6">
                  <a
                    href="/login"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-lg font-medium text-black shadow-xl"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                    <ArrowUpRightIcon className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="liquid-glass w-[220px] rounded-[1.25rem] p-5">
      <div className="mb-8">{icon}</div>
      <div className="font-heading text-4xl italic leading-none tracking-[-1px] text-white">{value}</div>
      <p className="mt-2 text-xs font-body font-light text-white">{label}</p>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <FadingVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
        className="absolute left-1/2 top-0 z-0 -translate-x-1/2 object-cover object-top"
        style={{ width: "120%", height: "120%" }}
      />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 flex-col items-center justify-center px-4 pt-24 text-center">
          <motion.div
            initial={ANIM_INITIAL}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ ...ANIM_TRANSITION, delay: 0.4 }}
          >
            <div className="liquid-glass inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">New</span>
              <span className="text-sm text-white/90">Now includes Dashboard, ATS scoring, and guided prep plans</span>
            </div>
          </motion.div>

          <div className="mt-8">
            <BlurText
              text="Your AI Command Center for Interview Preparation"
              className="max-w-2xl justify-center font-heading text-6xl italic leading-[0.8] tracking-[-4px] text-white md:text-7xl lg:text-[5.5rem]"
            />
          </div>

          <motion.p
            className="mt-4 max-w-2xl text-sm font-body font-light leading-tight text-white md:text-base"
            initial={ANIM_INITIAL}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ ...ANIM_TRANSITION, delay: 0.8 }}
          >
            Analyze your resume, generate role-specific questions, plan daily prep, and improve ATS readiness with one
            unified workflow built for faster interview wins.
          </motion.p>

          <motion.div
            className="mt-6 flex items-center gap-6"
            initial={ANIM_INITIAL}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ ...ANIM_TRANSITION, delay: 1.1 }}
          >
            <a
              href="/login"
              className="liquid-glass-strong inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white"
            >
              <span>Get Started</span>
              <ArrowUpRightIcon className="h-5 w-5" />
            </a>
            <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-white">
              <span>Watch Demo</span>
              <PlayIcon className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            className="mt-8 flex items-stretch gap-4"
            initial={ANIM_INITIAL}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ ...ANIM_TRANSITION, delay: 1.3 }}
          >
            <StatCard
              value="77%"
              label="Average interview readiness score"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-7 w-7 text-white"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M8.8 12.8 11 15l4.5-5"></path>
                </svg>
              }
            />
            <StatCard
              value="5x"
              label="Faster prep with AI workflow automation"
              icon={
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-7 w-7 text-white"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M8 9.5h8M8 12h5M8 14.5h8"></path>
                </svg>
              }
            />
          </motion.div>
        </div>

        <motion.div
          className="flex flex-col items-center gap-4 pb-8"
          initial={ANIM_INITIAL}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ ...ANIM_TRANSITION, delay: 1.4 }}
        >
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white">
            Everything you need from first draft resume to final round confidence
          </div>
          <div className="flex flex-wrap items-center justify-center gap-12 text-2xl tracking-tight text-white md:gap-16 md:text-3xl">
            {["Dashboard", "Resume Analysis", "Question Gen", "Prep Plan", "ATS Builder"].map((brand) => (
              <span key={brand} className="font-heading italic">
                {brand}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CapabilityCard({ iconPath, tags, title, body }) {
  return (
    <div className="liquid-glass flex min-h-[360px] flex-col rounded-[1.25rem] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="liquid-glass flex h-11 w-11 items-center justify-center rounded-[0.75rem]">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white" aria-hidden="true">
            <path d={iconPath}></path>
          </svg>
        </div>
        <div className="flex max-w-[70%] flex-wrap justify-end gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-[11px] font-body text-white/90 whitespace-nowrap">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex-1"></div>
      <div className="mt-6">
        <h3 className="font-heading text-3xl italic leading-none tracking-[-1px] text-white md:text-4xl">{title}</h3>
        <p className="mt-3 max-w-[32ch] text-sm font-body font-light leading-snug text-white/90">{body}</p>
      </div>
    </div>
  );
}

function CapabilitiesSection() {
  const cards = [
    {
      title: "Dashboard",
      body: "Track your overall interview readiness in one place with score snapshots, activity history, and daily action prompts.",
      iconPath:
        "M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z",
      tags: ["Overview", "Activity Log", "Readiness", "Quick Actions"],
    },
    {
      title: "Resume Analysis",
      body: "Upload your resume to receive AI scoring, keyword gap detection, and actionable improvements to increase interview callbacks.",
      iconPath:
        "M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z",
      tags: ["ATS Score", "Keyword Match", "Section Feedback", "PDF Upload"],
    },
    {
      title: "Question Gen",
      body: "Generate targeted interview questions by role, company, and experience level with adaptive follow-up prompts.",
      iconPath:
        "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z",
      tags: ["Behavioral", "Technical", "Role Based", "Follow-ups"],
    },
    {
      title: "Prep Plan",
      body: "Build a structured day-by-day roadmap that converts weak areas into strengths before each interview milestone.",
      iconPath:
        "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z",
      tags: ["Daily Tasks", "Milestones", "Priority Areas", "Progress"],
    },
    {
      title: "ATS Builder",
      body: "Create ATS-friendly resume versions tailored to specific job descriptions while preserving your best achievements and impact.",
      iconPath:
        "M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm2-3h10v-2H7v2Zm0-4h10v-2H7v2Zm0-4h7V8H7v2Z",
      tags: ["JD Targeting", "ATS Safe", "Bullet Rewrite", "Versioning"],
    },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <FadingVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="relative z-10 flex min-h-screen flex-col px-8 pb-10 pt-24 md:px-16 lg:px-20">
        <div className="mb-auto">
          <motion.p
            className="mb-6 text-sm font-body text-white/80"
            initial={ANIM_INITIAL}
            whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={ANIM_TRANSITION}
            viewport={{ once: true, amount: 0.2 }}
          >
            // Capabilities
          </motion.p>
          <motion.h2
            className="font-heading text-6xl italic leading-[0.9] tracking-[-3px] text-white md:text-7xl lg:text-[6rem]"
            initial={ANIM_INITIAL}
            whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ ...ANIM_TRANSITION, delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            Platform
            <br />
            capabilities
          </motion.h2>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
            {cards.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={ANIM_INITIAL}
                whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                transition={{ ...ANIM_TRANSITION, delay: 0.15 + idx * 0.12 }}
                viewport={{ once: true, amount: 0.15 }}
              >
                <CapabilityCard {...card} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative bg-black px-8 py-20 lg:px-16 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <motion.div 
            className="col-span-1 lg:col-span-1"
            initial={ANIM_INITIAL}
            whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={ANIM_TRANSITION}
            viewport={{ once: true }}
          >
            <div className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full mb-6">
              <span className="font-heading text-3xl italic leading-none text-white">i</span>
            </div>
            <p className="max-w-xs text-sm font-body font-light text-white/50 leading-relaxed">
              Your AI-powered command center for mastering interview preparation and career growth. Built for the modern professional.
            </p>
          </motion.div>
          
          <motion.div
            initial={ANIM_INITIAL}
            whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ ...ANIM_TRANSITION, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-heading text-xl italic text-white mb-6 underline decoration-white/20 underline-offset-8">Platform</h4>
            <ul className="space-y-4 text-sm font-body font-light text-white/50">
              <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="/dashboard/analysis/new" className="hover:text-white transition-colors">Resume Analysis</a></li>
              <li><a href="/dashboard/ats" className="hover:text-white transition-colors">ATS Builder</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Question Bank</a></li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={ANIM_INITIAL}
            whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ ...ANIM_TRANSITION, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-heading text-xl italic text-white mb-6 underline decoration-white/20 underline-offset-8">Resources</h4>
            <ul className="space-y-4 text-sm font-body font-light text-white/50">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Prep Guides</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={ANIM_INITIAL}
            whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ ...ANIM_TRANSITION, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-heading text-xl italic text-white mb-6 underline decoration-white/20 underline-offset-8">Connect</h4>
            <div className="flex gap-4">
               <a href="#" className="liquid-glass flex h-10 w-10 items-center justify-center rounded-full text-white/60 hover:text-white transition-all">
                 <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3l-.5 3H13v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>
               </a>
               <a href="#" className="liquid-glass flex h-10 w-10 items-center justify-center rounded-full text-white/60 hover:text-white transition-all">
                 <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
               </a>
               <a href="#" className="liquid-glass flex h-10 w-10 items-center justify-center rounded-full text-white/60 hover:text-white transition-all">
                 <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324 4.162 4.162 0 010 8.324zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
               </a>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs font-body font-light text-white/30">
            © {new Date().getFullYear()} Ai Interview Platform. Developed by <span className="text-white/60 font-medium">Varun</span>. Elevated intelligence for your career.
          </p>
          <div className="flex gap-8 text-[11px] font-body font-light text-white/30 tracking-wider uppercase">
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Status</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function AiInterviewLandingPage() {
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === "string" && args[0].includes("Each child in a list should have a unique")) return;
      originalError(...args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <main className="bg-black text-white">
      <HeroSection />
      <CapabilitiesSection />
      <Footer />
    </main>
  );
}

