import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WellnessPrograms = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [joinedPrograms, setJoinedPrograms] = useState([]);
  const [paidPrograms, setPaidPrograms] = useState([]);

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;
    const saved = JSON.parse(localStorage.getItem(`wellness_${userEmail}`) || "[]") || [];
    setJoinedPrograms(saved);
    const paid = JSON.parse(localStorage.getItem(`paid_${userEmail}`) || "[]") || [];
    setPaidPrograms(paid);
  }, []);

  const handleJoinProgram = (program) => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("Unable to join program: user email not found.");
      return;
    }

    const existing = JSON.parse(localStorage.getItem(`wellness_${userEmail}`)) || [];
    const alreadyJoined = existing.some((item) => item.name === program.name);

    if (!alreadyJoined) {
      const updated = [...existing, program];
      localStorage.setItem(`wellness_${userEmail}`, JSON.stringify(updated));
      setJoinedPrograms(updated);
    }

    // Redirect to Payment (cart) page
    navigate("/payment");
  };

  // ✅ DEFAULT PROGRAMS
  const defaultPrograms = [
    {
      name: "Yoga Challenge",
      duration: "21 Days",
      price: 499,
      description:
        "Improve flexibility, posture and reduce daily stress through guided yoga sessions.",
    },
    {
      name: "Meditation Program",
      duration: "14 Days",
      price: 299,
      description:
        "Practice mindfulness and mental relaxation for better emotional balance.",
    },
    {
      name: "30-Day Fitness Challenge",
      duration: "30 Days",
      price: 699,
      description:
        "Build workout consistency and stamina with structured exercises.",
    },
  ];

  // ✅ LOAD ADMIN PROGRAMS
  useEffect(() => {
    const savedPrograms =
      JSON.parse(localStorage.getItem("wellnessPrograms")) || [];

    // merge default + admin programs
    setPrograms([...defaultPrograms, ...savedPrograms]);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Wellness Programs 🌿</h2>

      {/* PROGRAM CARDS */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {programs.map((program, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              width: "300px",
              background: "#fff",
            }}
          >
            <h3>{program.name}</h3>
            <p>{program.description}</p>
            <p><b>Duration:</b> {program.duration}</p>
            <p><b>Price:</b> ₹{program.price}</p>

            <button
              onClick={() => handleJoinProgram(program)}
              style={{
                marginTop: "10px",
                padding: "10px 18px",
                background: joinedPrograms.some((j) => j.name === program.name)
                  ? paidPrograms.some((p) => p.name === program.name)
                    ? "#22c55e"
                    : "#f59e0b"
                  : "#0ea5e9",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {joinedPrograms.some((j) => j.name === program.name)
                ? paidPrograms.some((p) => p.name === program.name)
                  ? "✅ Paid"
                  : "🛒 Go to Payment"
                : "Join Program"}
            </button>
          </div>
        ))}
      </div>

      {joinedPrograms.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h3 style={{ marginBottom: "12px", color: "#0f172a" }}>
            Your Joined Programs
          </h3>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            {joinedPrograms.map((program, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: "12px",
                  padding: "16px",
                  width: "260px",
                  background: "#f8fafc",
                }}
              >
                <h4 style={{ marginBottom: "8px" }}>{program.name}</h4>
                <p style={{ marginBottom: "6px", fontSize: "14px" }}>
                  Duration: {program.duration}
                </p>
                <p style={{ fontSize: "14px" }}>
                  Price: ₹{program.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}


    </div>
  );
};

export default WellnessPrograms;