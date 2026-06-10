"use client";

import { useState } from "react";

export default function ClientOnboarding() {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
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
        body: JSON.stringify({
          ...data,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setStatus("success");
        setData({
          name: "",
          email: "",
          phone: "",
          company: "",
          notes: "",
        });
      } else {
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
      console.error(error);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {status !== "success" ? (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>Let's talk</h1>
              <p style={styles.intro}>
                I work with established coaches and founders who are ready to build the systems that let them scale sustainably. Tell me about what you're building and let's see if we're a fit.
              </p>
            </div>

            {errorMessage && (
              <div style={styles.error}>{errorMessage}</div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.field}>
                <label htmlFor="name" style={styles.label}>Name</label>
                <input
                  type="text"
                  id="name"
                  value={data.name}
                  onChange={(e) => update("name", e.target.value)}
                  required
                  placeholder="Your name"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label htmlFor="email" style={styles.label}>Email</label>
                <input
                  type="email"
                  id="email"
                  value={data.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                  placeholder="your@email.com"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label htmlFor="phone" style={styles.label}>Phone</label>
                <input
                  type="tel"
                  id="phone"
                  value={data.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  required
                  placeholder="07700 900000"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label htmlFor="company" style={styles.label}>Business / Project</label>
                <input
                  type="text"
                  id="company"
                  value={data.company}
                  onChange={(e) => update("company", e.target.value)}
                  required
                  placeholder="What are you building?"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label htmlFor="notes" style={styles.label}>Tell me more</label>
                <textarea
                  id="notes"
                  value={data.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  required
                  placeholder="What's on your mind? What challenges are you facing? What does success look like?"
                  style={styles.textarea}
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                style={styles.button}
              >
                {status === "loading" ? "Sending..." : "Send"}
              </button>
            </form>
          </>
        ) : (
          <div style={styles.success}>
            <div style={styles.checkmark}>✓</div>
            <h2 style={styles.successTitle}>Got it</h2>
            <p style={styles.successText}>
              Thanks for reaching out. I've got everything I need and will be in touch within 24 hours. You're in good hands.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#faf8f5",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1.5rem",
  },
  container: {
    maxWidth: "520px",
    width: "100%",
  },
  header: {
    marginBottom: "3rem",
    textAlign: "center",
  },
  title: {
    fontSize: "42px",
    fontWeight: 600,
    color: "#2c2c2a",
    marginBottom: "1.5rem",
    letterSpacing: "-0.5px",
  },
  intro: {
    fontSize: "16px",
    lineHeight: 1.7,
    color: "#5c5c5a",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#2c2c2a",
    marginBottom: "0.75rem",
    letterSpacing: "0.3px",
  },
  input: {
    padding: "12px 14px",
    border: "1px solid #e0dbd5",
    borderRadius: "6px",
    fontSize: "15px",
    color: "#2c2c2a",
    background: "#fff",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  textarea: {
    padding: "12px 14px",
    border: "1px solid #e0dbd5",
    borderRadius: "6px",
    fontSize: "15px",
    color: "#2c2c2a",
    background: "#fff",
    minHeight: "120px",
    resize: "vertical",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  button: {
    marginTop: "1rem",
    padding: "13px 24px",
    background: "#2c2c2a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    letterSpacing: "0.3px",
  },
  error: {
    padding: "12px 14px",
    background: "#fce8e8",
    border: "1px solid #d4a5a5",
    borderRadius: "6px",
    color: "#a85c5c",
    fontSize: "14px",
    marginBottom: "1.5rem",
  },
  success: {
    textAlign: "center",
    padding: "2rem",
  },
  checkmark: {
    width: "60px",
    height: "60px",
    margin: "0 auto 1.5rem",
    borderRadius: "50%",
    background: "#e8e6e0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    color: "#2c2c2a",
  },
  successTitle: {
    fontSize: "28px",
    fontWeight: 600,
    color: "#2c2c2a",
    marginBottom: "0.75rem",
  },
  successText: {
    fontSize: "15px",
    lineHeight: 1.7,
    color: "#5c5c5a",
  },
};
