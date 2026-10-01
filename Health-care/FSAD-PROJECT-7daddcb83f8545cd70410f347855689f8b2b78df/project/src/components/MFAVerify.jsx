import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";

const MFAVerify = ({ setIsLoggedIn }) => {

  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!code) {
      setMessage("Enter the 6-digit authentication code.");
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const username = localStorage.getItem("username");

      await axios.post("http://localhost:8081/api/auth/verify-otp", {
        username: username,
        otp: code
      });

      // SUCCESS LOGIN
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);

      const role = localStorage.getItem("userRole");

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error(error);
      setMessage("Invalid OTP. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      <div className="absolute inset-0 bg-[url('/fit.jpg')] bg-cover bg-center opacity-15"></div>

      <div className="relative w-full max-w-lg">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Multi-Factor Authentication</h2>
            <p className="text-white/80">Enter the 6-digit code from your authenticator app.</p>
          </div>

          {/* Show QR code only on first setup */}
          {localStorage.getItem("qrCodeUrl") && (
            <div className="flex flex-col items-center mb-6 bg-white p-4 rounded-2xl w-max mx-auto shadow-xl">
               <p className="text-slate-800 text-sm mb-3 font-semibold text-center">
                 Scan this with Google Authenticator.<br/>You will only see this once!
               </p>
               <img src={localStorage.getItem("qrCodeUrl")} alt="QR Code" className="w-48 h-48" />
            </div>
          )}

          {message && (
            <div className="bg-amber-100 text-amber-800 px-4 py-3 rounded-xl mb-6">
              {message}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <input
              type="text"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 border border-white/20 focus:outline-none focus:border-cyan-400 transition"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-xl font-semibold transition"
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>

          {/* ── RE-SCAN QR BUTTON ── */}
          <RescanQR navigate={navigate} />

          <div className="mt-4 text-center text-white/80">
            <p>
              Not you?{" "}
              <Link to="/login" className="text-white font-medium underline underline-offset-2">
                Return to login
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────
   Re-scan QR sub-component
   Resets the MFA secret in the backend so
   the next login shows a fresh QR code.
─────────────────────────────────────────── */
const RescanQR = ({ navigate }) => {
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState('');

  const handleRescan = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      setResetMsg("No session found. Please go back to login first.");
      return;
    }

    const confirmed = window.confirm(
      `Reset MFA for "${username}"?\n\nYou will need to re-scan a new QR code the next time you log in.`
    );
    if (!confirmed) return;

    setResetting(true);
    setResetMsg('');
    try {
      await axios.post("http://localhost:8081/api/auth/reset-mfa", { username });
      localStorage.removeItem("qrCodeUrl");
      setResetMsg("MFA reset! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      console.error(err);
      setResetMsg("Reset failed. Make sure the backend is running.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div style={{ marginTop: "28px", textAlign: "center" }}>
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.15)",
        paddingTop: "22px",
      }}>
        <p style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "13px",
          marginBottom: "12px",
          letterSpacing: "0.01em",
        }}>
          Lost access to your authenticator app?
        </p>

        <button
          onClick={handleRescan}
          disabled={resetting}
          style={{
            padding: "11px 26px",
            background: resetting
              ? "rgba(255,255,255,0.08)"
              : "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "white",
            border: resetting ? "1px solid rgba(255,255,255,0.15)" : "none",
            borderRadius: "14px",
            fontWeight: "700",
            fontSize: "14px",
            cursor: resetting ? "not-allowed" : "pointer",
            boxShadow: resetting ? "none" : "0 4px 16px rgba(245,158,11,0.45)",
            transition: "all 0.25s",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            opacity: resetting ? 0.6 : 1,
          }}
          onMouseOver={e => { if (!resetting) e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <span style={{ fontSize: "17px" }}>📷</span>
          {resetting ? "Resetting..." : "Re-scan QR Code"}
        </button>

        {resetMsg && (
          <p style={{
            marginTop: "14px",
            fontSize: "13px",
            fontWeight: "600",
            color: resetMsg.includes("Redirect") || resetMsg.includes("reset!") ? "#86efac" : "#fca5a5",
          }}>
            {resetMsg.includes("Redirect") ? "✅ " : resetMsg.includes("failed") ? "❌ " : ""}
            {resetMsg}
          </p>
        )}
      </div>
    </div>
  );
};

export default MFAVerify;