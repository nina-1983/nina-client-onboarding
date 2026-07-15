"use client";

import { useState, useRef } from "react";

export default function ClientOnboarding() {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    postcode: "",
    notes: "",
  });

  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const canvasRef = useRef(null);

  function update(field, value) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, submittedAt: new Date().toISOString() }),
      });

      if (res.ok) {
        setStatus("success");
        setData({ name: "", email: "", phone: "", company: "", address: "", postcode: "", notes: "" });
        launchConfetti(canvasRef.current);
      } else {
        const errorData = await res.json();
        setStatus("error");
        setErrorMessage(errorData.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
      console.error("Submission error:", error);
    }
  }

  function handleReset() {
    setData({ name: "", email: "", phone: "", company: "", address: "", postcode: "", notes: "" });
  }

  return (
    <main style={s.page}>
      <canvas ref={canvasRef} style={s.canvas} />

      <nav style={s.nav}>
        <span style={s.navLogo}>Nina Mistry <span style={s.navRole}>| Launch Architect</span></span>
        <a href="https://nina-mistry.com" style={s.navBack}>← Back to site</a>
      </nav>

      <div style={s.container}>
        <header style={s.header}>
          <p style={s.tag}>New client onboarding</p>
          <h1 style={s.h1}>
            Let's get<br />
            <em style={s.h1Em}>started.</em>
          </h1>
          <p style={s.sub}>
            Fill in your details below and I'll be in touch soon to get things moving.
          </p>
        </header>

        <div style={s.card} className="form-card">
          <div style={s.cardAccent} />

          {errorMessage && <div style={s.errorBox}>{errorMessage}</div>}

          {status !== "success" ? (
            <form onSubmit={handleSubmit}>
              <Section title="Your details">
                <Field label="Full name">
                  <input type="text" value={data.name} onChange={e => update("name", e.target.value)}
                    required placeholder="Alex Johnson" style={s.input} />
                </Field>
                <Field label="Email address">
                  <input type="email" value={data.email} onChange={e => update("email", e.target.value)}
                    required placeholder="hello@yourbusiness.com" style={s.input} />
                </Field>
                <Field label="Contact number">
                  <input type="tel" value={data.phone} onChange={e => update("phone", e.target.value)}
                    required placeholder="07700 900000" style={s.input} />
                </Field>
              </Section>

              <Section title="Business details">
                <Field label="Company name">
                  <input type="text" value={data.company} onChange={e => update("company", e.target.value)}
                    required placeholder="Your Business Ltd" style={s.input} />
                </Field>
                <div style={s.twoCol} className="two-col">
                  <Field label="Address line 1">
                    <input type="text" value={data.address} onChange={e => update("address", e.target.value)}
                      required placeholder="123 Main Street" style={s.input} />
                  </Field>
                  <Field label="Postcode">
                    <input type="text" value={data.postcode} onChange={e => update("postcode", e.target.value)}
                      required placeholder="SW1A 1AA" style={s.input} />
                  </Field>
                </div>
              </Section>

              <Section title="Tell me more">
                <Field label="What's your project about?">
                  <textarea value={data.notes} onChange={e => update("notes", e.target.value)}
                    required placeholder="Tell me about your vision, goals, or specific challenges. The more you share, the better I can help."
                    style={s.textarea} />
                </Field>
              </Section>

              <div style={s.footer}>
                <button type="submit" disabled={status === "loading"} style={s.btnPrimary}>
                  {status === "loading" ? "Sending…" : "Let's build together"}
                </button>
                <button type="reset" onClick={handleReset} style={s.btnOutline}>Clear</button>
              </div>
            </form>
          ) : (
            <div style={s.success} className="success-enter">
              <div style={s.successCircle} className="success-pop">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M6 16l7 7L26 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="success-check" />
                </svg>
              </div>
              <h2 style={s.successTitle} className="success-fade">You're in.</h2>
              <p style={s.successMsg} className="success-fade-delay">
                I've got everything I need. I'll be in touch soon — can't wait to see what we build together.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{css}</style>
    </main>
  );
}

function launchConfetti(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colours = ["#85d0cd", "#326ab3", "#6783c2", "#f4c82c", "#f9d8da", "#1c2b3a"];
  const pieces = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    w: Math.random() * 8 + 4,
    h: Math.random() * 4 + 2,
    colour: colours[Math.floor(Math.random() * colours.length)],
    rot: Math.random() * Math.PI * 2,
    vx: (Math.random() - 0.5) * 2.5,
    vy: Math.random() * 3.5 + 2,
    vr: (Math.random() - 0.5) * 0.12,
  }));

  let frame;
  let start = null;
  const duration = 2500;

  function draw(ts) {
    if (!start) start = ts;
    const elapsed = ts - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.colour;
      ctx.globalAlpha = Math.max(0, 1 - elapsed / duration);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    if (elapsed < duration) {
      frame = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  frame = requestAnimationFrame(draw);
  setTimeout(() => cancelAnimationFrame(frame), duration + 100);
}

function Section({ title, children }) {
  return (
    <div style={s.section}>
      <h2 style={s.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      {children}
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "var(--off-white)" },
  canvas: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 100 },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", background: "rgba(250,250,249,0.92)", borderBottom: "1px solid rgba(133,208,205,0.25)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 10 },
  navLogo: { fontSize: "13px", fontWeight: 600, color: "var(--dark)", letterSpacing: "0.5px", textTransform: "uppercase" },
  navRole: { fontWeight: 400, color: "var(--mid)" },
  navBack: { fontSize: "13px", color: "var(--blue)", textDecoration: "none", fontWeight: 500 },
  container: { maxWidth: "680px", margin: "0 auto", padding: "60px 24px 80px" },
  header: { marginBottom: "48px" },
  tag: { fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--teal)", marginBottom: "16px", borderLeft: "2px solid var(--teal)", paddingLeft: "12px" },
  h1: { fontFamily: "var(--font-bodoni), 'Bodoni Moda', Georgia, serif", fontSize: "clamp(48px, 8vw, 72px)", fontWeight: 700, lineHeight: 1.05, color: "var(--dark)", marginBottom: "20px" },
  h1Em: { fontStyle: "italic", fontWeight: 400, color: "var(--blue)" },
  sub: { fontSize: "16px", color: "var(--mid)", lineHeight: 1.7, maxWidth: "480px" },
  card: { background: "var(--white)", borderRadius: "8px", padding: "48px", boxShadow: "0 4px 24px rgba(28,43,58,0.07)", border: "1px solid rgba(133,208,205,0.2)", position: "relative", overflow: "hidden" },
  cardAccent: { position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, var(--teal) 0%, var(--blue) 50%, var(--periwinkle) 100%)" },
  errorBox: { padding: "14px 16px", background: "#fff4f5", border: "1.5px solid var(--blush)", borderRadius: "6px", fontSize: "14px", color: "#c0392b", marginBottom: "32px" },
  section: { marginBottom: "40px" },
  sectionTitle: { fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--mid)", marginBottom: "24px", paddingBottom: "12px", borderBottom: "1px solid rgba(133,208,205,0.3)" },
  field: { marginBottom: "20px" },
  label: { display: "block", fontSize: "12px", fontWeight: 600, color: "var(--dark)", marginBottom: "8px", letterSpacing: "0.5px", textTransform: "uppercase" },
  input: { width: "100%", padding: "12px 14px", border: "1.5px solid #dde3ea", borderRadius: "6px", fontSize: "15px", color: "var(--dark)", background: "var(--white)", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s", outline: "none" },
  textarea: { width: "100%", padding: "12px 14px", border: "1.5px solid #dde3ea", borderRadius: "6px", fontSize: "15px", color: "var(--dark)", background: "var(--white)", fontFamily: "inherit", minHeight: "120px", resize: "vertical", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s", outline: "none" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  footer: { display: "flex", gap: "12px", paddingTop: "32px", borderTop: "1px solid var(--off-white)", marginTop: "8px" },
  btnPrimary: { flex: 1, padding: "15px 32px", background: "var(--blue)", color: "white", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s, transform 0.2s" },
  btnOutline: { padding: "15px 28px", background: "transparent", color: "var(--blue)", border: "1.5px solid var(--blue)", borderRadius: "6px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s, transform 0.2s" },
  success: { padding: "48px 0 24px", textAlign: "center" },
  successCircle: { width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg, var(--teal), var(--blue))", margin: "0 auto 28px", display: "flex", alignItems: "center", justifyContent: "center" },
  successTitle: { fontFamily: "var(--font-bodoni), 'Bodoni Moda', Georgia, serif", fontSize: "44px", fontStyle: "italic", fontWeight: 400, color: "var(--dark)", marginBottom: "12px" },
  successMsg: { fontSize: "15px", color: "var(--mid)", lineHeight: 1.7, maxWidth: "400px", margin: "0 auto" },
};

const css = `
  :root {
    --teal: #85d0cd;
    --blue: #326ab3;
    --periwinkle: #6783c2;
    --yellow: #f4c82c;
    --blush: #f9d8da;
    --dark: #1c2b3a;
    --mid: #4a5568;
    --white: #fafaf9;
    --off-white: #f5f4f2;
    --font-bodoni: 'Bodoni Moda', Georgia, serif;
  }

  input:focus, textarea:focus {
    border-color: var(--teal) !important;
    box-shadow: 0 0 0 3px rgba(133,208,205,0.2) !important;
  }

  button[type="submit"]:hover:not(:disabled) {
    background: #2558a0 !important;
    transform: translateY(-2px);
  }

  button[type="reset"]:hover {
    background: rgba(50,106,179,0.06) !important;
    transform: translateY(-2px);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @keyframes popIn {
    0% { transform: scale(0); opacity: 0; }
    60% { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes drawCheck {
    from { stroke-dashoffset: 40; }
    to { stroke-dashoffset: 0; }
  }

  .success-pop {
    animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .success-check {
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    animation: drawCheck 0.4s ease 0.4s forwards;
  }

  .success-fade {
    opacity: 0;
    animation: fadeUp 0.5s ease 0.3s forwards;
  }

  .success-fade-delay {
    opacity: 0;
    animation: fadeUp 0.5s ease 0.5s forwards;
  }

  @media (max-width: 600px) {
    .two-col {
      grid-template-columns: 1fr !important;
    }
    .form-card {
      padding: 28px 20px !important;
    }
    nav {
      padding: 16px 20px !important;
    }
    nav span, nav a {
      font-size: 11px !important;
    }
  }
`;
