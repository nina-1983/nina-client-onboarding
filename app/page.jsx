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

  const [status, setStatus] = useState("idle"); // idle, loading, success, error
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
          address: "",
          postcode: "",
          notes: "",
        });
      } else {
        setStatus("error");
        setErrorMessage("Oops! Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Oops! Something went wrong. Please try again.");
      console.error(error);
    }
  }

  function handleReset() {
    setData({
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      postcode: "",
      notes: "",
    });
  }

  return (
    <section style={styles.section}>
      {/* Animated Background Blobs */}
      <div style={styles.blobsContainer}>
        <div style={styles.blob1}></div>
        <div style={styles.blob2}></div>
        <div style={styles.blob3}></div>
      </div>

      {/* Content Container */}
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.h1}>
            Hi, I'm <span style={styles.gradient}>Nina</span>
          </h1>
          <p style={styles.subtitle}>
            I help established coaches and founders build the systems and
            automation that let them scale without burning out.
          </p>
          <p style={styles.subtitle}>
            Whether it's membership platforms, email funnels, or operational
            infrastructure, we'll build something that actually works for your
            business.
          </p>
        </div>

        {/* Form Wrapper */}
        <div style={styles.formWrapper}>
          <div style={styles.topBorder}></div>

          {errorMessage && (
            <div style={styles.errorBox}>{errorMessage}</div>
          )}

          {status !== "success" && (
            <form onSubmit={handleSubmit}>
              {/* Section 1: Your Details */}
              <div style={styles.section1}>
                <div style={styles.sectionHeader}>
                  <div style={styles.iconBox}>👤</div>
                  <h2 style={styles.h2}>Your details</h2>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="name" style={styles.label}>
                    Full name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={data.name}
                    onChange={(e) => update("name", e.target.value)}
                    required
                    placeholder="e.g. Alex Johnson"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="email" style={styles.label}>
                    Email address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={data.email}
                    onChange={(e) => update("email", e.target.value)}
                    required
                    placeholder="hello@business.co.uk"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="phone" style={styles.label}>
                    Contact number *
                  </label>
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
              </div>

              {/* Section 2: Business Details */}
              <div style={styles.section2}>
                <div style={styles.sectionHeader}>
                  <div style={styles.iconBox}>🏢</div>
                  <h2 style={styles.h2}>Business details</h2>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="company" style={styles.label}>
                    Company name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={data.company}
                    onChange={(e) => update("company", e.target.value)}
                    required
                    placeholder="Your Business Ltd"
                    style={styles.input}
                  />
                </div>

                <div style={styles.gridContainer}>
                  <div style={styles.formGroup}>
                    <label htmlFor="address" style={styles.label}>
                      Address line 1 *
                    </label>
                    <input
                      type="text"
                      id="address"
                      value={data.address}
                      onChange={(e) => update("address", e.target.value)}
                      required
                      placeholder="123 Main Street"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label htmlFor="postcode" style={styles.label}>
                      Postcode *
                    </label>
                    <input
                      type="text"
                      id="postcode"
                      value={data.postcode}
                      onChange={(e) => update("postcode", e.target.value)}
                      required
                      placeholder="SW1A 1AA"
                      style={styles.input}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Tell us more */}
              <div style={styles.section3}>
                <div style={styles.sectionHeader}>
                  <div style={styles.iconBox}>💬</div>
                  <h2 style={styles.h2}>Tell us more</h2>
                </div>

                <div style={styles.formGroup}>
                  <label htmlFor="notes" style={styles.label}>
                    What's your project about? *
                  </label>
                  <textarea
                    id="notes"
                    value={data.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    required
                    placeholder="Tell me about your vision, goals, or specific challenges. The more you share, the better I can help."
                    style={styles.textarea}
                  ></textarea>
                </div>
              </div>

              {/* Form Footer */}
              <div style={styles.formFooter}>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={styles.submitButton}
                >
                  {status === "loading"
                    ? "Submitting..."
                    : "Let's build together 🚀"}
                </button>
                <button
                  type="reset"
                  onClick={handleReset}
                  style={styles.resetButton}
                >
                  Clear
                </button>
              </div>
            </form>
          )}

          {status === "success" && (
            <div style={styles.successState}>
              <div style={styles.successIcon}>✨</div>
              <h3 style={styles.successTitle}>You're in, lovely!</h3>
              <p style={styles.successMessage}>
                I've got all the details and will be in touch within 24 hours.
                Can't wait to see what we build together.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{keyframes}</style>
    </section>
  );
}

const styles = {
  section: {
    background:
      "linear-gradient(180deg, #faf8f5 0%, #f5f0eb 50%, #fff9f3 100%)",
    padding: "3rem 1.5rem",
    position: "relative",
    overflow: "hidden",
    minHeight: "100vh",
  },
  blobsContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 0,
  },
  blob1: {
    position: "absolute",
    width: "320px",
    height: "320px",
    background: "radial-gradient(circle at 30% 30%, #e8304f, #f9d8da)",
    borderRadius: "45% 55% 60% 40% / 55% 45% 40% 60%",
    top: "-120px",
    right: "-80px",
    opacity: 0.25,
    mixBlendMode: "multiply",
    animation: "float 15s infinite ease-in-out",
  },
  blob2: {
    position: "absolute",
    width: "280px",
    height: "280px",
    background: "radial-gradient(circle at 40% 40%, #85d0cd, #c8e6e3)",
    borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
    bottom: "5%",
    left: "-100px",
    opacity: 0.25,
    mixBlendMode: "multiply",
    animation: "float 20s infinite ease-in-out 2s",
  },
  blob3: {
    position: "absolute",
    width: "240px",
    height: "240px",
    background: "radial-gradient(circle at 50% 50%, #6783c2, #b5d4f4)",
    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
    top: "40%",
    right: "3%",
    opacity: 0.25,
    mixBlendMode: "multiply",
    animation: "float 18s infinite ease-in-out 1s",
  },
  container: {
    maxWidth: "720px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  header: {
    textAlign: "center",
    marginBottom: "3rem",
    animation: "fadeIn 0.7s ease-out",
  },
  h1: {
    fontSize: "48px",
    fontWeight: 700,
    lineHeight: 1.15,
    marginBottom: "20px",
    color: "#2c2c2a",
  },
  gradient: {
    background: "linear-gradient(135deg, #e8304f 0%, #85d0cd 50%, #6783c2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
    lineHeight: 1.7,
    marginBottom: "12px",
  },
  formWrapper: {
    background: "white",
    borderRadius: "24px",
    padding: "3.5rem",
    boxShadow: "0 25px 70px rgba(0, 0, 0, 0.09)",
    border: "1px solid rgba(232, 48, 79, 0.08)",
    position: "relative",
    overflow: "hidden",
    animation: "scaleUp 0.6s ease-out 0.2s both",
  },
  topBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "5px",
    background: "linear-gradient(90deg, #e8304f 0%, #85d0cd 50%, #6783c2 100%)",
  },
  errorBox: {
    padding: "14px 16px",
    background: "linear-gradient(135deg, #fff4f5 0%, #ffe8eb 100%)",
    border: "2px solid #e8304f",
    borderRadius: "12px",
    fontSize: "14px",
    color: "#e8304f",
    marginBottom: "1.5rem",
    fontWeight: 600,
  },
  section1: {
    marginBottom: "2.5rem",
    animation: "fadeIn 0.8s ease-out 0.4s both",
  },
  section2: {
    marginBottom: "2.5rem",
    animation: "fadeIn 0.8s ease-out 0.5s both",
  },
  section3: {
    marginBottom: "2.5rem",
    animation: "fadeIn 0.8s ease-out 0.6s both",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "1.5rem",
  },
  iconBox: {
    width: "44px",
    height: "44px",
    background: "linear-gradient(135deg, #e8304f 0%, #85d0cd 100%)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    animation: "iconSpin 0.6s ease-out",
  },
  h2: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#2c2c2a",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 700,
    color: "#2c2c2a",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  input: {
    width: "100%",
    padding: "13px 16px",
    border: "2px solid #e8e8e8",
    borderRadius: "12px",
    fontSize: "15px",
    color: "#2c2c2a",
    background: "#fafafa",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "13px 16px",
    border: "2px solid #e8e8e8",
    borderRadius: "12px",
    fontSize: "15px",
    color: "#2c2c2a",
    background: "#fafafa",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    minHeight: "110px",
    resize: "vertical",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
  },
  formFooter: {
    marginTop: "2.5rem",
    paddingTop: "2rem",
    borderTop: "2px solid #f0f0f0",
    display: "flex",
    gap: "12px",
  },
  submitButton: {
    padding: "14px 28px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    background: "linear-gradient(135deg, #e8304f 0%, #85d0cd 100%)",
    color: "white",
    flex: 1,
    boxShadow: "0 10px 25px rgba(232, 48, 79, 0.35)",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  resetButton: {
    padding: "14px 28px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 700,
    border: "2px solid #e8e8e8",
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    background: "linear-gradient(135deg, #f5f5f5 0%, #f0f0f0 100%)",
    color: "#2c2c2a",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  successState: {
    textAlign: "center",
    padding: "2rem 0",
  },
  successIcon: {
    width: "90px",
    height: "90px",
    margin: "0 auto 1.5rem",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #e8304f 0%, #85d0cd 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "48px",
    boxShadow: "0 15px 40px rgba(232, 48, 79, 0.35)",
    animation: "popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  successTitle: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#2c2c2a",
    marginBottom: "10px",
  },
  successMessage: {
    fontSize: "15px",
    color: "#666",
    lineHeight: 1.7,
  },
};

const keyframes = `
  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(35px, -35px) rotate(90deg); }
    50% { transform: translate(0, 35px) rotate(180deg); }
    75% { transform: translate(-35px, -25px) rotate(270deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleUp {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes iconSpin {
    from {
      transform: rotate(-180deg) scale(0);
      opacity: 0;
    }
    to {
      transform: rotate(0) scale(1);
      opacity: 1;
    }
  }

  @keyframes popIn {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.15);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  input:focus, textarea:focus {
    outline: none;
    border-color: #e8304f !important;
    background: white !important;
    box-shadow: 0 0 0 5px rgba(232, 48, 79, 0.12) !important;
    transform: translateY(-2px) !important;
  }

  button:hover:not(:disabled) {
    transform: translateY(-4px);
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
