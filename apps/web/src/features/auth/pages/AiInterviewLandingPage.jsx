import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  BarChart2, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  LayoutDashboard, 
  Menu, 
  MessageSquare, 
  Target, 
  X
} from "lucide-react";

// --- Framer Motion Configurations ---
const easeOut = [0.16, 1, 0.3, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const viewportOpts = { once: true, amount: 0.15, margin: "-60px" };

// --- Components ---

function Badge({ children, pulse = false }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-m-accent/30 bg-m-accent/5 px-4 py-1.5 sm:px-5 sm:py-2">
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-m-accent opacity-75"></span>
        )}
        <span className="relative inline-flex h-2 w-2 rounded-full bg-m-accent"></span>
      </span>
      <span className="font-m-mono text-[10px] sm:text-xs font-medium uppercase tracking-[0.15em] text-m-accent">
        {children}
      </span>
    </div>
  );
}

function PrimaryButton({ children, href, className = "" }) {
  return (
    <a
      href={href}
      className={`group relative inline-flex h-12 sm:h-14 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-m-accent to-m-accent-secondary px-6 sm:px-8 font-m-body text-base font-medium text-m-accent-foreground shadow-m-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-m-accent-lg hover:brightness-110 active:scale-[0.98] ${className}`}
    >
      {children}
    </a>
  );
}

function OutlineButton({ children, href, className = "" }) {
  return (
    <a
      href={href}
      className={`group inline-flex h-12 sm:h-14 items-center justify-center gap-2 rounded-xl border border-m-border bg-transparent px-6 sm:px-8 font-m-body text-base font-medium text-m-foreground transition-all duration-200 hover:border-m-accent/30 hover:bg-m-muted hover:shadow-m-sm active:scale-[0.98] ${className}`}
    >
      {children}
    </a>
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
    <nav className="absolute top-0 z-50 w-full pt-6">
      <div className="mx-auto flex max-w-container-max items-center justify-between px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-m-accent to-m-accent-secondary shadow-m-accent">
            <span className="font-m-display text-xl font-bold text-white">i</span>
          </div>
          <span className="font-m-display text-xl font-medium tracking-tight text-m-foreground">AiPrep</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-m-body text-sm font-medium text-m-muted-foreground transition-colors hover:text-m-foreground"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <a href="/login" className="font-m-body text-sm font-medium text-m-foreground transition-colors hover:text-m-accent">
            Log in
          </a>
          <a
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-m-foreground px-5 font-m-body text-sm font-medium text-m-background transition-all hover:bg-m-foreground/90 active:scale-[0.98]"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-m-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute inset-x-4 top-20 z-40 rounded-2xl border border-m-border bg-m-card p-6 shadow-m-xl md:hidden"
          >
            <div className="flex flex-col gap-6">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-m-body text-lg font-medium text-m-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px w-full bg-m-border" />
              <div className="flex flex-col gap-4">
                <a
                  href="/login"
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-m-muted font-m-body font-medium text-m-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </a>
                <a
                  href="/login"
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-m-accent to-m-accent-secondary font-m-body font-medium text-white shadow-m-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function HeroGraphic() {
  return (
    <div className="relative flex h-full min-h-[400px] w-full items-center justify-center lg:min-h-[600px]">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(0,82,255,0.08)_0%,transparent_60%)]" />

      {/* Rotating Ring */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute h-[85%] w-[85%] rounded-full border border-dashed border-m-accent/20"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute h-[65%] w-[65%] rounded-full border border-dashed border-m-accent/15"
      />

      {/* Floating Elements */}
      <div className="relative h-full w-full max-w-[500px]">
        {/* Main Card */}
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-m-border bg-m-card p-6 shadow-m-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="h-3 w-1/3 rounded-full bg-m-muted" />
            <div className="h-6 w-12 rounded-full bg-m-accent/10" />
          </div>
          <div className="mb-2 h-4 w-3/4 rounded-full bg-m-muted-foreground/20" />
          <div className="mb-6 h-4 w-1/2 rounded-full bg-m-muted-foreground/20" />
          
          <div className="flex items-center gap-4 pt-4 border-t border-m-border/50">
            <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-m-accent to-m-accent-secondary" />
            <div className="w-full">
              <div className="mb-2 h-2.5 w-1/2 rounded-full bg-m-muted" />
              <div className="h-2 w-1/3 rounded-full bg-m-muted" />
            </div>
          </div>
        </motion.div>

        {/* Small floating badges */}
        <motion.div
          animate={{ y: [6, -6, 6] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -right-4 top-1/4 rounded-xl border border-m-border bg-m-card p-4 shadow-m-lg flex items-center gap-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="h-2 w-16 rounded-full bg-m-muted-foreground/20" />
        </motion.div>

        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -left-8 bottom-1/4 rounded-xl border border-m-border bg-m-card p-4 shadow-m-lg flex flex-col gap-3"
        >
          <div className="h-2 w-20 rounded-full bg-m-muted-foreground/20" />
          <div className="flex items-end gap-2">
            <div className="h-8 w-3 rounded-sm bg-m-accent/20" />
            <div className="h-12 w-3 rounded-sm bg-m-accent/40" />
            <div className="h-16 w-3 rounded-sm bg-m-accent" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-m-background pt-32 pb-24 md:pt-40 md:pb-32 lg:pt-48 lg:pb-44">
      {/* Decorative Blur Corner */}
      <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-m-accent opacity-[0.04] blur-[150px]" />
      
      <div className="mx-auto max-w-container-max px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 items-center">
          
          {/* Left Column: Text */}
          <motion.div 
            className="max-w-3xl"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeInUp}>
              <Badge pulse>New Workflow Enabled</Badge>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="mt-8 font-m-display text-[2.75rem] sm:text-6xl lg:text-[5.25rem] leading-[1.05] tracking-[-0.02em] text-m-foreground"
            >
              Preparation <br className="hidden sm:block" />
              Crafted for You <br />
              Not <span className="relative inline-block">
                <span className="gradient-text italic pr-2">Guesswork</span>
                <span className="gradient-underline" />
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="mt-8 max-w-2xl font-m-body text-lg text-m-muted-foreground leading-relaxed"
            >
              Analyze your resume, generate role-specific questions, plan daily prep, and improve ATS readiness with one unified workflow built for faster interview wins.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
            >
              <PrimaryButton href="/login" className="w-full sm:w-auto">
                <span>Start Preparing Free</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </PrimaryButton>
              <OutlineButton href="#features" className="w-full sm:w-auto">
                How It Works
              </OutlineButton>
            </motion.div>

            {/* Micro Stats */}
            <motion.div 
              variants={fadeInUp}
              className="mt-14 flex items-center gap-8 border-t border-m-border pt-8"
            >
              <div>
                <p className="font-m-display text-3xl font-medium text-m-foreground">77%</p>
                <p className="font-m-body text-sm font-medium text-m-muted-foreground mt-1">Avg. Readiness Score</p>
              </div>
              <div className="h-12 w-px bg-m-border" />
              <div>
                <p className="font-m-display text-3xl font-medium text-m-foreground">5x</p>
                <p className="font-m-body text-sm font-medium text-m-muted-foreground mt-1">Faster Automation</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Visual */}
          <motion.div 
            className="hidden lg:block h-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: easeOut, delay: 0.2 }}
          >
            <HeroGraphic />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function CapabilityCard({ icon: Icon, title, description, tags }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-m-md transition-all duration-300 hover:shadow-m-accent hover:-translate-y-1">
      {/* Hover Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-m-accent/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-m-accent to-m-accent-secondary shadow-m-sm transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      
      <div className="relative z-10 mt-auto pt-16">
        <h3 className="font-m-display text-2xl text-white tracking-tight">{title}</h3>
        <p className="mt-3 font-m-body text-[15px] leading-relaxed text-slate-400">{description}</p>
        
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-800 px-3 py-1 font-m-mono text-[11px] font-medium uppercase tracking-wider text-slate-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CapabilitiesSection() {
  const capabilities = [
    {
      title: "Command Dashboard",
      description: "Track your overall interview readiness in one place with score snapshots, activity history, and daily action prompts.",
      icon: LayoutDashboard,
      tags: ["Overview", "Readiness", "Actions"]
    },
    {
      title: "Resume Analysis",
      description: "Receive AI scoring, keyword gap detection, and actionable improvements to increase interview callbacks instantly.",
      icon: FileText,
      tags: ["ATS Score", "Keywords", "PDF"]
    },
    {
      title: "Question Generator",
      description: "Generate targeted interview questions by role, company, and experience level with adaptive follow-up prompts.",
      icon: MessageSquare,
      tags: ["Behavioral", "Technical", "Role"]
    },
    {
      title: "Preparation Plan",
      description: "Build a structured day-by-day roadmap that converts weak areas into strengths before each milestone.",
      icon: Target,
      tags: ["Daily Tasks", "Milestones", "Progress"]
    },
    {
      title: "ATS Builder",
      description: "Create ATS-friendly resume versions tailored to specific job descriptions while preserving your impact.",
      icon: BarChart2,
      tags: ["JD Targeting", "ATS Safe", "Rewrite"]
    }
  ];

  return (
    <section id="features" className="relative overflow-hidden bg-m-foreground py-28 md:py-36">
      {/* Texture Layer */}
      <div className="absolute inset-0 texture-dots opacity-[0.03]" />
      
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/3 rounded-full bg-m-accent opacity-[0.05] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-container-max px-6 lg:px-8">
        <motion.div 
          className="max-w-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOpts}
          variants={stagger}
        >
          <motion.div variants={fadeInUp}>
            <Badge>Platform Capabilities</Badge>
          </motion.div>
          <motion.h2 
            variants={fadeInUp}
            className="mt-6 font-m-display text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.15] text-white"
          >
            Everything you need for <br className="hidden sm:block"/>
            <span className="gradient-text italic pr-2">Interview Success</span>
          </motion.h2>
        </motion.div>

        <motion.div 
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOpts}
          variants={stagger}
        >
          {capabilities.map((cap, idx) => (
            <motion.div 
              key={idx} 
              variants={fadeInUp}
              className={idx === 0 || idx === 3 ? "lg:col-span-2" : "lg:col-span-1"}
            >
              <CapabilityCard {...cap} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative overflow-hidden bg-m-background py-28 md:py-40">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOpts}
          variants={stagger}
        >
          <motion.h2 
            variants={fadeInUp}
            className="font-m-display text-4xl sm:text-5xl md:text-6xl text-m-foreground tracking-tight"
          >
            Ready to elevate your <br/>
            <span className="gradient-text italic pr-2">Career Journey?</span>
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="mt-6 mx-auto max-w-xl font-m-body text-lg text-m-muted-foreground"
          >
            Join thousands of professionals who have transformed their interview anxiety into confident offers.
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            className="mt-10 flex justify-center"
          >
            <PrimaryButton href="/login" className="w-full sm:w-auto h-14 text-lg px-10">
              <span>Create Your Free Account</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </PrimaryButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-m-border bg-m-background py-16">
      <div className="mx-auto max-w-container-max px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-m-foreground">
              <span className="font-m-display text-sm font-bold text-m-background">i</span>
            </div>
            <span className="font-m-display text-lg font-medium tracking-tight text-m-foreground">AiPrep</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 font-m-body text-sm text-m-muted-foreground">
            <a href="#" className="hover:text-m-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-m-accent transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-m-accent transition-colors">Contact Support</a>
          </div>
        </div>
        
        <div className="mt-8 text-center md:text-left border-t border-m-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-m-body text-xs text-m-muted-foreground">
            © {new Date().getFullYear()} Ai Interview Platform. Elevated intelligence for your career.
          </p>
          <div className="flex gap-4 opacity-60">
            {/* Social Icons placeholder */}
            <div className="h-5 w-5 rounded bg-m-muted-foreground/30" />
            <div className="h-5 w-5 rounded bg-m-muted-foreground/30" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function AiInterviewLandingPage() {
  return (
    <main className="min-h-screen bg-m-background selection:bg-m-accent/20 selection:text-m-accent">
      <Navbar />
      <HeroSection />
      <CapabilitiesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
