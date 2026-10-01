import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");
  const [cartItems, setCartItems] = useState([]);
  const [paidItems, setPaidItems] = useState([]);
  const [activePayment, setActivePayment] = useState(null);

  useEffect(() => {
    if (!userEmail) return;
    // Cart = joined programs that haven't been paid yet
    const joined = JSON.parse(localStorage.getItem(`wellness_${userEmail}`)) || [];
    const paid = JSON.parse(localStorage.getItem(`paid_${userEmail}`)) || [];
    setPaidItems(paid);
    const unpaid = joined.filter(
      (p) => !paid.some((paid) => paid.name === p.name)
    );
    setCartItems(unpaid);
  }, [userEmail]);

  const handlePayNow = (program) => {
    setActivePayment(program);
  };

  const handleConfirmPayment = (program) => {
    const paid = JSON.parse(localStorage.getItem(`paid_${userEmail}`)) || [];
    const updated = [...paid, { ...program, paidAt: new Date().toISOString() }];
    localStorage.setItem(`paid_${userEmail}`, JSON.stringify(updated));
    setPaidItems(updated);
    setCartItems((prev) => prev.filter((p) => p.name !== program.name));
    setActivePayment(null);
    alert(`✅ Payment successful for "${program.name}"!`);
  };

  const handleRemoveFromCart = (program) => {
    // Remove from joined programs (cart)
    const joined = JSON.parse(localStorage.getItem(`wellness_${userEmail}`)) || [];
    const updated = joined.filter((p) => p.name !== program.name);
    localStorage.setItem(`wellness_${userEmail}`, JSON.stringify(updated));
    setCartItems((prev) => prev.filter((p) => p.name !== program.name));
  };

  const total = cartItems.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #ede9fe 100%)",
      padding: "100px 24px 40px",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderRadius: "24px",
          padding: "32px",
          marginBottom: "24px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          border: "1px solid rgba(255,255,255,0.6)",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}>
          <span style={{ fontSize: "40px" }}>🛒</span>
          <div>
            <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#1e293b" }}>
              Your Cart
            </h1>
            <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "15px" }}>
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} pending payment
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            style={{
              marginLeft: "auto",
              padding: "10px 22px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              color: "#475569",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.2s",
            }}
            onMouseOver={e => e.target.style.background = "#e2e8f0"}
            onMouseOut={e => e.target.style.background = "#f8fafc"}
          >
            ← Back
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start" }}>

          {/* Cart Items */}
          <div>
            {cartItems.length === 0 ? (
              <div style={{
                background: "rgba(255,255,255,0.92)",
                borderRadius: "24px",
                padding: "60px 32px",
                textAlign: "center",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                border: "1px solid rgba(255,255,255,0.6)",
              }}>
                <span style={{ fontSize: "64px" }}>🎉</span>
                <h3 style={{ color: "#1e293b", marginTop: "16px" }}>No pending payments!</h3>
                <p style={{ color: "#64748b" }}>All your programs are paid for.</p>
                <button
                  onClick={() => navigate("/dashboard")}
                  style={{
                    marginTop: "16px",
                    padding: "12px 28px",
                    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "15px",
                  }}
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {cartItems.map((program, index) => (
                  <div
                    key={index}
                    style={{
                      background: "rgba(255,255,255,0.92)",
                      backdropFilter: "blur(12px)",
                      borderRadius: "20px",
                      padding: "24px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                      border: activePayment?.name === program.name
                        ? "2px solid #3b82f6"
                        : "1px solid rgba(255,255,255,0.6)",
                      transition: "all 0.3s",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                          <span style={{
                            background: "linear-gradient(135deg, #dbeafe, #ede9fe)",
                            borderRadius: "10px",
                            padding: "8px",
                            fontSize: "20px",
                          }}>💪</span>
                          <h3 style={{ margin: 0, color: "#1e293b", fontSize: "18px", fontWeight: "700" }}>
                            {program.name}
                          </h3>
                        </div>
                        <p style={{ color: "#64748b", margin: "0 0 4px", fontSize: "14px" }}>
                          {program.description}
                        </p>
                        <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                          <span style={{
                            background: "#f0fdf4",
                            color: "#16a34a",
                            borderRadius: "8px",
                            padding: "4px 12px",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}>
                            📅 {program.duration}
                          </span>
                          <span style={{
                            background: "#fef3c7",
                            color: "#d97706",
                            borderRadius: "8px",
                            padding: "4px 12px",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}>
                            ₹{program.price}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginLeft: "16px" }}>
                        <button
                          onClick={() => handlePayNow(program)}
                          style={{
                            padding: "10px 20px",
                            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                            boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                          }}
                        >
                          Pay Now
                        </button>
                        <button
                          onClick={() => handleRemoveFromCart(program)}
                          style={{
                            padding: "8px 16px",
                            background: "#fef2f2",
                            color: "#ef4444",
                            border: "1px solid #fecaca",
                            borderRadius: "10px",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "13px",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Inline QR Payment */}
                    {activePayment?.name === program.name && (
                      <div style={{
                        marginTop: "20px",
                        padding: "24px",
                        background: "linear-gradient(135deg, #eff6ff, #f5f3ff)",
                        borderRadius: "16px",
                        border: "1px solid #bfdbfe",
                        textAlign: "center",
                        animation: "fadeIn 0.3s ease",
                      }}>
                        <h4 style={{ margin: "0 0 8px", color: "#1e293b", fontSize: "17px", fontWeight: "700" }}>
                          Scan & Pay via UPI
                        </h4>
                        <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 16px" }}>
                          Paying ₹{program.price} for {program.name}
                        </p>
                        <div style={{
                          display: "inline-block",
                          padding: "12px",
                          background: "white",
                          borderRadius: "16px",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                          marginBottom: "16px",
                        }}>
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=yourupi@upi&pn=FitWell&am=${program.price}`}
                            alt="UPI QR Code"
                            style={{ display: "block", borderRadius: "8px" }}
                          />
                        </div>
                        <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "16px" }}>
                          After payment, click Confirm below
                        </p>
                        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                          <button
                            onClick={() => handleConfirmPayment(program)}
                            style={{
                              padding: "12px 28px",
                              background: "linear-gradient(135deg, #22c55e, #16a34a)",
                              color: "white",
                              border: "none",
                              borderRadius: "10px",
                              fontWeight: "700",
                              cursor: "pointer",
                              fontSize: "15px",
                              boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
                            }}
                          >
                            ✅ Confirm Payment
                          </button>
                          <button
                            onClick={() => setActivePayment(null)}
                            style={{
                              padding: "12px 20px",
                              background: "#f1f5f9",
                              color: "#475569",
                              border: "1px solid #e2e8f0",
                              borderRadius: "10px",
                              fontWeight: "600",
                              cursor: "pointer",
                              fontSize: "14px",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Paid Programs History */}
            {paidItems.length > 0 && (
              <div style={{ marginTop: "32px" }}>
                <h3 style={{ color: "#1e293b", fontWeight: "700", marginBottom: "12px" }}>
                  ✅ Payment History
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {paidItems.map((program, index) => (
                    <div key={index} style={{
                      background: "rgba(240,253,244,0.9)",
                      border: "1px solid #bbf7d0",
                      borderRadius: "16px",
                      padding: "16px 20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: "600", color: "#166534" }}>{program.name}</p>
                        <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#4ade80" }}>
                          Paid • {program.duration}
                        </p>
                      </div>
                      <span style={{
                        background: "#dcfce7",
                        color: "#16a34a",
                        borderRadius: "8px",
                        padding: "4px 14px",
                        fontWeight: "700",
                        fontSize: "15px",
                      }}>₹{program.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div style={{
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(12px)",
              borderRadius: "24px",
              padding: "28px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              border: "1px solid rgba(255,255,255,0.6)",
              position: "sticky",
              top: "100px",
            }}>
              <h3 style={{ margin: "0 0 20px", color: "#1e293b", fontSize: "18px", fontWeight: "700" }}>
                Order Summary
              </h3>
              <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "16px", marginBottom: "16px" }}>
                {cartItems.map((p, i) => (
                  <div key={i} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                    fontSize: "14px",
                    color: "#475569",
                  }}>
                    <span>{p.name}</span>
                    <span style={{ fontWeight: "600" }}>₹{p.price}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <span style={{ fontWeight: "700", color: "#1e293b", fontSize: "17px" }}>Total</span>
                <span style={{
                  fontWeight: "800",
                  color: "#6366f1",
                  fontSize: "20px",
                }}>₹{total}</span>
              </div>
              <button
                onClick={() => cartItems.length === 1 ? handlePayNow(cartItems[0]) : alert("Please pay for each program individually.")}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  color: "white",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontSize: "16px",
                  boxShadow: "0 6px 20px rgba(99,102,241,0.35)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseOver={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 10px 28px rgba(99,102,241,0.45)"; }}
                onMouseOut={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 6px 20px rgba(99,102,241,0.35)"; }}
              >
                Proceed to Pay
              </button>
              <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "12px", marginTop: "12px" }}>
                🔒 Secure UPI payment
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
