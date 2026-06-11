"use client";

import { useState } from "react";

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
      } else {
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  function handleReset() {
    setData({ name: "", email: "", phone: "", company: "", address: "", postcode: "", notes: "" });
  }

  return (
    <main style={s.page}>
      {/* Nav */}
      <nav style={s.nav}>
        <span style={s.navLogo}>Nina Mistry <span style={s.navRole}>| Launch Architect</span></span>
        <a href="https://nina-mistry.com" style={s.navBack}>← Back to site</a>
      </nav>

      <div style={s.container}>
        {/* Header */}
        <header style={s.header}>
          <p style={s.tag}>New client onboarding</p>
          <h1 style={s.h1}>
            Let's get<br />
            <em style={s.h1Em}>started.</em>
          </h1>
          <p style={s.sub}>
            Fill in your details below and I'll be in touch within 24 hours to get things moving.
          </p>
        </header>

        {/* Form card */}
        <div style={s.card}>
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
                <div style={s.twoCol}>
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
            <div style={s.success}>
              <div style={s.successDot} />
              <h2 style={s.successTitle}>You're in.</h2>
              <p style={s.successMsg}>
                I've got everything I need. Expect to hear from me within 24 hours — can't wait to see what we build together.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{css}</style>
    </main>
  );
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
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 40px",
    background: "rgba(250,250,249,0.92)",
    borderBottom: "1px solid rgba(133,208,205,0.25)",
    backdropFilter: "blur(8px)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  navLogo: {
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--dark)",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  navRole: {
    fontWeight: 400,
    color: "var(--mid)",
  },
  navBack: {
    fontSize: "13px",
    color: "var(--blue)",
    textDecoration: "none",
    fontWeight: 500,
  },
  container: {
    maxWidth: "680px",
    margin: "0 auto",
    padding: "60px 24px 80px",
  },
  header: {
    marginBottom: "48px",
  },
  tag: {
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "var(--teal)",
    marginBottom: "16px",
    borderLeft: "2px solid var(--teal)",
    paddingLeft: "12px",
  },
  h1: {
    fontFamily: "var(--font-bodoni), 'Bodoni Moda', Georgia, serif",
    fontSize: "clamp(48px, 8vw, 72px)",
    fontWeight: 700,
    lineHeight: 1.05,
    color: "var(--dark)",
    marginBottom: "20px",
  },
  h1Em: {
    fontStyle: "italic",
    fontWeight: 400,
    color: "var(--blue)",
  },
  sub: {
    fontSize: "16px",
    color: "var(--mid)",
    lineHeight: 1.7,
    maxWidth: "480px",
  },
  card: {
    background: "var(--white)",
    borderRadius: "8px",
    padding: "48px",
    boxShadow: "0 4px 24px rgba(28,43,58,0.07)",
    border: "1px solid rgba(133,208,205,0.2)",
    position: "relative",
    overflow: "hidden",
  },
  cardAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, var(--teal) 0%, var(--blue) 50%, var(--periwinkle) 100%)",
  },
  errorBox: {
    padding: "14px 16px",
    background: "#fff4f5",
    border: "1.5px solid var(--blush)",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#c0392b",
    marginBottom: "32px",
  },
  section: {
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "var(--mid)",
    marginBottom: "24px",
    paddingBottom: "12px",
    borderBottom: "1px solid rgba(133,208,205,0.3)",
  },
  field: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--dark)",
    marginBottom: "8px",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #dde3ea",
    borderRadius: "6px",
    fontSize: "15px",
    color: "var(--dark)",
    background: "var(--white)",
    fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #dde3ea",
    borderRadius: "6px",
    fontSize: "15px",
    color: "var(--dark)",
    background: "var(--white)",
    fontFamily: "inherit",
    minHeight: "120px",
    resize: "vertical",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
    outline: "none",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  footer: {
    display: "flex",
    gap: "12px",
    paddingTop: "32px",
    borderTop: "1px solid var(--off-white)",
    marginTop: "8px",
  },
  btnPrimary: {
    flex: 1,
    padding: "15px 32px",
    background: "var(--blue)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.2s, transform 0.2s",
  },
  btnOutline: {
    padding: "15px 28px",
    background: "transparent",
    color: "var(--blue)",
    border: "1.5px solid var(--blue)",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.2s, transform 0.2s",
  },
  success: {
    padding: "48px 0 24px",
    textAlign: "center",
  },
  successDot: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "var(--teal)",
    margin: "0 auto 24px",
  },
  successTitle: {
    fontFamily: "var(--font-bodoni), 'Bodoni Moda', Georgia, serif",
    fontSize: "40px",
    fontStyle: "italic",
    fontWeight: 400,
    color: "var(--dark)",
    marginBottom: "12px",
  },
  successMsg: {
    fontSize: "15px",
    color: "var(--mid)",
    lineHeight: 1.7,
    maxWidth: "400px",
    margin: "0 auto",
  },
};

const css = `
  input:focus, textarea:focus {
    border-color: var(--teal) !important;
    box-shadow: 0 0 0 3px rgba(133,208,205,0.2) !important;
  }

  .btn-primary:hover:not(:disabled), button[type="submit"]:hover:not(:disabled) {
    background: #2558a0 !important;
    transform: translateY(-1px);
  }

  button[type="reset"]:hover {
    background: rgba(50,106,179,0.06) !important;
    transform: translateY(-1px);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 560px) {
    .twoCol { grid-template-columns: 1fr !important; }
  }
`;
