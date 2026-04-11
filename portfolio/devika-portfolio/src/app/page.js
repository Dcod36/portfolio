"use client";
import { motion, useScroll, useSpring, useMotionValue, useTransform } from "framer-motion";
import { Award, Briefcase, GraduationCap, Code, Rocket, BrainCircuit, ExternalLink, Mail, ChevronDown, Sparkles } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";

// ───────────────────────────────────────────
// SVG Icons
// ───────────────────────────────────────────
const GithubIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

// ───────────────────────────────────────────
// Sparkle Cursor
// ───────────────────────────────────────────
const COLORS = ["#a855f7", "#ec4899", "#6366f1", "#38bdf8", "#f472b6", "#c084fc", "#fff"];
const STAR_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z' fill='currentColor'/></svg>`;

function SparkyCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef(null);

  const spawnSparkle = useCallback((x, y) => {
    const el = document.createElement("div");
    const size = 4 + Math.random() * 8;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const tx = (Math.random() - 0.5) * 60;
    const ty = (Math.random() - 0.5) * 60;
    el.className = "cursor-sparkle";
    el.style.cssText = `
      width:${size}px;height:${size}px;
      background:${color};
      box-shadow:0 0 ${size * 2}px ${color};
      left:${x}px;top:${y}px;
      --tx:${tx}px;--ty:${ty}px;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 700);
  }, []);

  const spawnStar = useCallback((x, y) => {
    const el = document.createElement("div");
    const size = 8 + Math.random() * 12;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const dx = (Math.random() - 0.5) * 30;
    const dy = (Math.random() - 0.5) * 30;
    el.className = "cursor-star";
    el.style.cssText = `
      width:${size}px;height:${size}px;
      color:${color};
      left:${x}px;top:${y}px;
      --dx:${dx}px;--dy:${dy}px;
      filter: drop-shadow(0 0 4px ${color});
    `;
    el.innerHTML = STAR_SVG;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 850);
  }, []);

  useEffect(() => {
    let sparkleCount = 0;
    let lastSparkle = 0;

    const onMove = (e) => {
      const x = e.clientX, y = e.clientY;
      pos.current = { x, y };
      if (dotRef.current) {
        dotRef.current.style.left = x + "px";
        dotRef.current.style.top = y + "px";
      }
      const now = Date.now();
      if (now - lastSparkle > 35) {
        lastSparkle = now;
        sparkleCount++;
        spawnSparkle(x, y);
        if (sparkleCount % 3 === 0) spawnStar(x, y);
      }
    };

    const animate = () => {
      if (ringRef.current) {
        ring.current.x += (pos.current.x - ring.current.x) * 0.12;
        ring.current.y += (pos.current.y - ring.current.y) * 0.12;
        ringRef.current.style.left = ring.current.x + "px";
        ringRef.current.style.top = ring.current.y + "px";
      }
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [spawnSparkle, spawnStar]);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

// ───────────────────────────────────────────
// Constellation Canvas
// ───────────────────────────────────────────
function ConstellationBg() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const STAR_COUNT = 120;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    let mouse = { x: w / 2, y: h / 2 };
    const onMouse = (e) => { mouse = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMouse);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0) s.x = w; if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h; if (s.y > h) s.y = 0;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,150,255,${s.alpha})`;
        ctx.fill();
      }
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        const dx = stars[i].x - mouse.x;
        const dy = stars[i].y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 150) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(168,85,247,${0.25 * (1 - d / 150)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

// ───────────────────────────────────────────
// Typewriter
// ───────────────────────────────────────────
const ROLES = [
  "AI & ML Enthusiast 🤖",
  "Computer Vision Explorer 👁️",
  "Deep Learning Learner 🧠",
  "Building Real-World Projects 🚀",
  "DSA & Problem Solving 💻",
];

function TypewriterLoop() {
  const [text, setText] = useState("");
  const [roleIdx, setRoleIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const role = ROLES[roleIdx];
    let timeout;
    if (!deleting && text.length < role.length) {
      timeout = setTimeout(() => setText(role.slice(0, text.length + 1)), 55);
    } else if (!deleting && text.length === role.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(text.slice(0, -1)), 30);
    } else {
      setDeleting(false);
      setRoleIdx((i) => (i + 1) % ROLES.length);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, roleIdx]);
  return (
    <span>
      {text}
      <span className="typed-cursor gradient-text">|</span>
    </span>
  );
}

// ───────────────────────────────────────────
// Section Heading
// ───────────────────────────────────────────
const SectionHeading = ({ children, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.7 }}
    viewport={{ once: true, margin: "-80px" }}
    className="flex items-center gap-4 mb-12"
  >
    <div className="relative">
      <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full" />
      {Icon && (
        <div className="relative w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/30 rounded-xl">
          <Icon className="w-6 h-6 text-purple-400" />
        </div>
      )}
    </div>
    <div>
      <h2 className="text-3xl md:text-4xl font-bold text-white">
        {children}
      </h2>
      <div className="h-1 w-16 mt-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
    </div>
  </motion.div>
);

// ───────────────────────────────────────────
// Glass Card
// ───────────────────────────────────────────
const GlassCard = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    viewport={{ once: true, margin: "-40px" }}
    whileHover={{ y: -6, scale: 1.01 }}
    className={`shimmer-card relative bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl rounded-2xl p-6 md:p-8 hover:bg-white/[0.07] transition-all duration-400 shadow-2xl ${className}`}
    style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)" }}
  >
    {children}
  </motion.div>
);

// ───────────────────────────────────────────
// Project Card
// ───────────────────────────────────────────
const ProjectCard = ({ title, subtitle, bullets, tags, tagColor, accent, delay, link }) => {
  const colorMap = {
    pink: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20", dot: "text-pink-500", glow: "rgba(236,72,153,0.3)" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", dot: "text-blue-500", glow: "rgba(59,130,246,0.3)" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", dot: "text-purple-500", glow: "rgba(168,85,247,0.3)" },
    green: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20", dot: "text-green-500", glow: "rgba(34,197,94,0.3)" },
    teal: { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/20", dot: "text-teal-500", glow: "rgba(20,184,166,0.3)" },
  };
  const c = colorMap[tagColor] || colorMap.purple;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="shimmer-card group relative bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl rounded-2xl p-6 md:p-8 hover:bg-white/[0.07] transition-all duration-400 cursor-pointer overflow-hidden"
      style={{ boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)` }}
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 0%, ${c.glow} 0%, transparent 70%)` }}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 group-hover:bg-clip-text transition-all duration-300">
            {title}
          </h3>
          <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors flex-shrink-0 mt-1 ml-2" />
        </div>
        <p className={`${c.text} text-xs font-semibold uppercase tracking-wider mb-4`}>{subtitle}</p>
        <ul className="space-y-2 text-gray-400 text-sm mb-6">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className={`${c.dot} mt-1 flex-shrink-0`}>▹</span>
              {b}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className={`skill-badge px-3 py-1 ${c.bg} ${c.text} text-xs rounded-full border ${c.border} font-medium`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ───────────────────────────────────────────
// Stat Badge
// ───────────────────────────────────────────
const StatBadge = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="text-center"
  >
    <div className="text-4xl font-black gradient-text mb-1">{value}</div>
    <div className="text-gray-500 text-xs uppercase tracking-widest">{label}</div>
  </motion.div>
);

// ───────────────────────────────────────────
// Main Page
// ───────────────────────────────────────────
export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-[#030014] text-gray-200 font-sans overflow-x-hidden selection:bg-purple-500/30">

      {/* Sparkly cursor */}
      {mounted && <SparkyCursor />}

      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Constellation */}
      <ConstellationBg />

      {/* Ambient orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="orb absolute top-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
            "--dur": "18s", "--delay": "0s",
          }}
        />
        <div
          className="orb absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
            "--dur": "22s", "--delay": "-8s",
          }}
        />
        <div
          className="orb absolute top-[40%] right-[15%] w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)",
            "--dur": "14s", "--delay": "-4s",
          }}
        />
      </div>

      {/* ── NAV ── */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="nav-pill px-6 py-3 flex gap-6 items-center"
        >
          <span className="text-sm font-semibold gradient-text">DS</span>
          <div className="w-px h-4 bg-white/10" />
          {["about", "projects", "experience", "contact"].map((s) => (
            <a
              key={s}
              href={`#${s}`}
              className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
            >
              {s}
            </a>
          ))}
          <div className="w-px h-4 bg-white/10" />
          <div className="flex gap-3 items-center">
            <a href="https://github.com/Dcod36" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">
              <GithubIcon className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/in/devika-santhosh-7b73472b2" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a href="mailto:devikasanthosh389@gmail.com" className="text-gray-400 hover:text-purple-400 transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </nav>

      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 md:px-8 flex flex-col gap-36 pb-32">

        {/* ── HERO ── */}
        <section className="min-h-screen flex flex-col justify-center pt-24 relative -ml-4 md:-ml-8 pl-0">
          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-16 items-center">

            {/* Text */}
            <div className="text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium uppercase tracking-widest mb-6"
              >
                <Sparkles className="w-3 h-3" />
                Available for opportunities
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 leading-[0.95] tracking-tight"
              >
                Devika
                <br />
                <span className="gradient-text glow-text">Santhosh</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="text-xl md:text-2xl text-gray-400 font-medium mb-6 h-8"
              >
                <TypewriterLoop />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-gray-500 text-base md:text-lg max-w-lg mb-10 leading-relaxed"
              >
                Interested in AI and Computer Vision, building projects to solve real-world problems.
                <br />3rd Year B.Tech IT @ SOE, CUSAT · Diploma in Programming @ IIT Madras
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.8 }}
                className="flex flex-wrap gap-4 mb-12"
              >
                <a
                  href="#projects"
                  className="group relative px-8 py-3.5 rounded-full font-semibold text-sm overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center gap-2 text-white">
                    <Rocket className="w-4 h-4" /> View My Work
                  </span>
                </a>
                <a
                  href="#contact"
                  className="px-8 py-3.5 rounded-full font-semibold text-sm border border-white/10 text-gray-300 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all"
                >
                  Get In Touch
                </a>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex gap-8 border-t border-white/5 pt-8"
              >
                <StatBadge value="3+" label="Hackathons" delay={0.75} />
                <StatBadge value="4+" label="Projects" delay={0.8} />
                <StatBadge value="8.6" label="CGPA" delay={0.85} />
              </motion.div>
            </div>

            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex justify-center md:justify-end"
            >
              <div className="relative float-anim">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 blur-2xl scale-110" />
                {/* Rotating border */}
                <div
                  className="absolute inset-[-3px] rounded-full"
                  style={{
                    background: "conic-gradient(from 0deg, #7c3aed, #db2777, #2563eb, #7c3aed)",
                    animation: "spin 6s linear infinite",
                  }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                {/* Image */}
                <div className="relative w-64 h-64 md:w-[360px] md:h-[360px] rounded-full overflow-hidden bg-gray-900 border-4 border-[#030014]">
                  <img
                    src="/profile.jpg"
                    alt="Devika Santhosh"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://i.pinimg.com/1200x/bc/39/3a/bc393ad242da53ba8771dbbe072236af.jpg";
                    }}
                  />
                </div>
                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                  className="absolute -bottom-4 -right-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl px-4 py-2 shadow-2xl"
                >
                  <div className="text-white font-bold text-sm">🏆 Award Winner</div>
                  <div className="text-purple-200 text-xs">HackEuropa · TinkerHack</div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Scroll cue */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-gray-600 text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </motion.div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" className="scroll-mt-24">
          <SectionHeading icon={BrainCircuit}>About Me</SectionHeading>
          <div className="grid md:grid-cols-3 gap-6">
            <GlassCard className="md:col-span-2">
              <div className="space-y-5 text-gray-400 text-base md:text-lg leading-relaxed">
                <p>
                  I am an <strong className="text-white font-semibold">Information Technology undergraduate at CUSAT</strong>{" "}
                  pursuing a dual degree with IIT Madras Data Science, with a strong passion for Artificial Intelligence and machine learning.
                </p>
                <p>
                  I thrive on building intelligent systems that go beyond theory—from real-time computer vision pipelines to
                  AI-powered accessibility tools. My work blends deep learning, optimization, and thoughtful UX.
                </p>
                <p>
                  I actively compete in hackathons, winning 1st at TinkerHack and placing 3rd at HackEuropa — held at SOE, CUSAT.
                </p>
                <p className="text-purple-300 font-medium italic border-l-2 border-purple-500 pl-4">
                  &ldquo;Always building, always learning—looking for opportunities to create meaningful impact.&rdquo;
                </p>
              </div>
            </GlassCard>

            {/* Quick facts */}
            <div className="flex flex-col gap-4">
              {[
                { label: "🎓 University", value: "CUSAT, Kerala" },
                { label: "📊 CGPA", value: "8.6 / 10" },
                { label: "🤖 Focus", value: "AI · CV · ML" },
                { label: "📍 Location", value: "Kerala, India" },
                { label: "⚡ Status", value: "Open to Work" },
              ].map(({ label, value }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between px-5 py-3 bg-white/[0.04] border border-white/[0.07] rounded-xl"
                >
                  <span className="text-gray-500 text-sm">{label}</span>
                  <span className="text-white text-sm font-medium">{value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ACHIEVEMENTS ── */}
        <section id="achievements" className="scroll-mt-24">
          <SectionHeading icon={Award}>Achievements</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: "🥉",
                title: "HackEuropa — SOE CUSAT",
                badge: "3rd Prize",
                badgeColor: "text-yellow-400",
                desc: "Built an inclusive learning platform for accessibility — competing at HackEuropa held at SOE, CUSAT.",
                delay: 0.1,
              },
              {
                emoji: "🥇",
                title: "TinkerHack – CUSAT",
                badge: "1st Prize",
                badgeColor: "text-pink-400",
                desc: "Developed Nexo — a DeepFace-based live facial recognition missing-person identification system.",
                delay: 0.2,
              },
              {
                emoji: "🚀",
                title: "TechSprint (GDG CUSAT)",
                badge: "Top 10 Finalist",
                badgeColor: "text-blue-400",
                desc: "Selected from 99+ teams for TraffiQ — an AI-powered adaptive traffic optimization system.",
                delay: 0.3,
              },
            ].map(({ emoji, title, badge, badgeColor, desc, delay }) => (
              <GlassCard key={title} delay={delay}>
                <div className="text-5xl mb-5">{emoji}</div>
                <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
                <p className={`text-sm font-semibold uppercase tracking-wider mb-3 ${badgeColor}`}>{badge}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* ── EXPERIENCE ── */}
        <section id="experience" className="scroll-mt-24">
          <SectionHeading icon={Briefcase}>Experience</SectionHeading>
          <div className="space-y-6">
            {[
              {
                title: "AI & Computational Thinking Intern",
                company: "MATLAB",
                date: "June 2025",
                color: "purple",
                bullets: [
                  "Worked on supervised learning and optimization techniques using MATLAB",
                  "Improved model performance through systematic hyperparameter tuning",
                  "Gained practical exposure to predictive modeling and data analysis pipelines",
                ],
              },
              {
                title: "Project Intern",
                company: "FabLab",
                date: "May 2024",
                color: "blue",
                bullets: [
                  "Built an interactive robotic pet using Arduino with real-time behavior",
                  "Integrated IR and ultrasonic sensors for obstacle detection",
                  "Reduced prototype cost by 30% using in-house 3D printing",
                  "Performed circuit debugging and system-level optimization",
                ],
              },
            ].map(({ title, company, date, color, bullets }) => (
              <GlassCard key={title} delay={0.1}>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="text-purple-400 font-semibold mt-0.5">{company}</p>
                  </div>
                  <span className="mt-3 md:mt-0 text-xs px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-gray-400 w-fit">
                    {date}
                  </span>
                </div>
                <ul className="space-y-2 text-gray-400 text-sm">
                  {bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-purple-500 mt-0.5 flex-shrink-0">▹</span> {b}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects" className="scroll-mt-24">
          <SectionHeading icon={Rocket}>Projects</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProjectCard
              title="Nexo – AI Visual Recovery"
              subtitle="TinkerHack 1st Prize · Missing Person ID"
              bullets={[
                "Live facial recognition & cosine matching via DeepFace",
                "Automated WhatsApp alerts through Twilio API",
                "AI Support Assistant powered by Google Gemini API",
              ]}
              tags={["DeepFace", "Twilio", "Gemini AI", "Computer Vision"]}
              tagColor="pink"
              delay={0.1}
            />
            <ProjectCard
              title="Inclusive Learning Assistant"
              subtitle="HackEuropa (SOE CUSAT) 3rd Prize · Accessibility Platform"
              bullets={[
                "AI Reading Coach & Text-to-Figure visual explainer via Gemini",
                "Smart Voice Notes & Focus Line reading with Web Speech API",
                "Gamified ASL recognition built with MediaPipe & scikit-learn",
                "Universal a11y widget — OpenDyslexic font, contrast modes",
              ]}
              tags={["Gemini AI", "MediaPipe", "Web Speech API", "scikit-learn"]}
              tagColor="blue"
              delay={0.2}
            />
            <ProjectCard
              title="TraffiQ – AI Traffic Optimization"
              subtitle="TechSprint Top 10 · Adaptive Signal Control"
              bullets={[
                "YOLO-based vehicle detection with real-time lane density analysis",
                "Adaptive signal adjustment algorithm reducing wait times",
                "Full simulation dashboard with live traffic visualization",
              ]}
              tags={["YOLO", "OpenCV", "Computer Vision", "Python"]}
              tagColor="purple"
              delay={0.3}
            />
            <ProjectCard
              title="Smart Finance & Budget Tracker"
              subtitle="Full-Stack · Personal Finance Analytics"
              bullets={[
                "Automated transaction detection by parsing SMS & notifications",
                "Real-time budget planning, shared expenses, and smart alerts",
                "Secure auth & cloud storage backed by Firebase Firestore",
              ]}
              tags={["Flutter", "Firebase", "Dart", "Analytics"]}
              tagColor="green"
              delay={0.4}
            />
          </div>
        </section>

        {/* ── EDUCATION & SKILLS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section id="education" className="scroll-mt-24">
            <SectionHeading icon={GraduationCap}>Education</SectionHeading>
            <div className="space-y-6 relative pl-6">
              <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-purple-600 via-blue-600 to-pink-600 opacity-40" />
              {[
                { dot: "#a855f7", title: "B.Tech – Information Technology", inst: "CUSAT, Kochi", meta: "CGPA: 8.6 · 2022–2026" },
                { dot: "#3b82f6", title: "BS – Data Science (Online)", inst: "IIT Madras", meta: "CGPA: 6.13 · Ongoing" },
                { dot: "#ec4899", title: "Certifications", inst: "NPTEL", meta: "Elite – Artificial Intelligence (82%)" },
              ].map(({ dot, title, inst, meta }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div
                    className="absolute -left-[28px] top-2 w-4 h-4 rounded-full border-2 border-[#030014]"
                    style={{ background: dot, boxShadow: `0 0 10px ${dot}` }}
                  />
                  <h3 className="text-base font-bold text-white">{title}</h3>
                  <p className="text-purple-400 text-sm font-medium">{inst}</p>
                  <p className="text-gray-500 text-xs mt-1">{meta}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="skills" className="scroll-mt-24">
            <SectionHeading icon={Code}>Skills</SectionHeading>
            <GlassCard>
              <div className="space-y-5">
                {[
                  { cat: "Languages", items: ["Python", "C++", "JavaScript", "Dart"], color: "purple" },
                  { cat: "AI / ML", items: ["YOLO", "OpenCV", "DeepFace", "MediaPipe", "scikit-learn", "Deep Learning"], color: "pink" },
                  { cat: "Web & Mobile", items: ["Next.js", "React", "Tailwind", "Flutter", "FastAPI", "HTML/CSS"], color: "blue" },
                  { cat: "Tools", items: ["Git", "GitHub", "Arduino", "Jupyter", "MATLAB", "Firebase"], color: "green" },
                ].map(({ cat, items, color }) => {
                  const clr = { purple: "bg-purple-500/10 text-purple-300 border-purple-500/20", pink: "bg-pink-500/10 text-pink-300 border-pink-500/20", blue: "bg-blue-500/10 text-blue-300 border-blue-500/20", green: "bg-green-500/10 text-green-300 border-green-500/20" }[color];
                  return (
                    <div key={cat}>
                      <h4 className="text-xs text-gray-600 uppercase tracking-widest mb-2 font-semibold">{cat}</h4>
                      <div className="flex gap-2 flex-wrap">
                        {items.map((s) => (
                          <span key={s} className={`skill-badge px-3 py-1 text-xs rounded-full border font-medium ${clr}`}>{s}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </section>
        </div>

        {/* ── CONTACT ── */}
        <section id="contact" className="scroll-mt-24">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-12 text-center"
            style={{ boxShadow: "0 0 80px rgba(124,58,237,0.1), inset 0 1px 0 rgba(255,255,255,0.05)" }}
          >
            {/* Decorative blobs */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-600/10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-600/10 blur-3xl rounded-full pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <div className="text-5xl mb-4">✨</div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Let&apos;s Build Something{" "}
                <span className="gradient-text">Amazing</span>
              </h2>
              <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto">
                I&apos;m always open to exciting projects, collaborations, and new opportunities.
                Drop me a message — I&apos;d love to hear from you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="mailto:devikasanthosh389@gmail.com"
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
                >
                  <div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Mail className="w-5 h-5 relative" />
                  <span className="relative">Say Hello 👋</span>
                </a>
                <a
                  href="https://linkedin.com/in/devika-santhosh-7b73472b2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold border border-white/10 text-gray-300 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all"
                >
                  <LinkedinIcon className="w-5 h-5" />
                  Connect on LinkedIn
                </a>
              </div>
            </motion.div>
          </div>

          <div className="mt-16 text-center text-gray-700 text-xs border-t border-white/5 pt-8">
            <p>© {new Date().getFullYear()} Devika Santhosh · Built with Next.js, Framer Motion & ✨</p>
          </div>
        </section>

      </main>
    </div>
  );
}
