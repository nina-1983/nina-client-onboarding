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
  page: {
    minHeight: "100vh",
    background: "var(--off-white)",
  },
  canvas: {
