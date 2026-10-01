import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");
  const [cartCount, setCartCount] = useState(0);

  // Compute unpaid cart count
  useEffect(() => {
    if (!userEmail || !isLoggedIn) { setCartCount(0); return; }
    const joined = JSON.parse(localStorage.getItem(`wellness_${userEmail}`)) || [];
    const paid   = JSON.parse(localStorage.getItem(`paid_${userEmail}`)) || [];
    const unpaid = joined.filter((p) => !paid.some((pd) => pd.name === p.name));
    setCartCount(unpaid.length);

    // Poll every 2 seconds so badge refreshes when programs are joined
    const interval = setInterval(() => {
      const j = JSON.parse(localStorage.getItem(`wellness_${userEmail}`)) || [];
      const p = JSON.parse(localStorage.getItem(`paid_${userEmail}`)) || [];
      setCartCount(j.filter((x) => !p.some((y) => y.name === x.name)).length);
    }, 2000);
    return () => clearInterval(interval);
  }, [userEmail, isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50">

      {/* Glass Navbar */}
      <div className="flex justify-between items-center px-8 py-4 
      bg-gradient-to-r from-black/70 via-gray-900/70 to-black/70 
      backdrop-blur-lg border-b border-white/10 shadow-lg">

        {/* LEFT (empty for spacing) */}
        <div className="w-1/3"></div>

        {/* CENTER LOGO */}
        <Link to="/" className="group">
          <span className="text-4xl font-bebas tracking-wider uppercase bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:via-blue-400 group-hover:to-cyan-500 transition-all duration-300">
            FitWell
          </span>
        </Link>

        {/* RIGHT BUTTONS */}
        <div className="flex gap-4 w-1/3 justify-end items-center">
          {!isLoggedIn ? (
            <>
              <Link to="/login">
                <button className="px-5 py-2 rounded-full 
                bg-white/10 text-white border border-white/20 
                hover:bg-white hover:text-black transition duration-300">
                  Login
                </button>
              </Link>

              <Link to="/register">
                <button className="px-5 py-2 rounded-full 
                bg-gradient-to-r from-blue-500 to-cyan-500 
                text-white hover:scale-105 transition duration-300 shadow-md">
                  Register
                </button>
              </Link>
            </>
          ) : (
            <>
              {role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="px-5 py-2 rounded-full 
                  bg-purple-500/80 text-white hover:bg-purple-600 transition"
                >
                  Admin Panel
                </button>
              )}

              {/* CART ICON - only for students */}
              {role === "student" && (
                <button
                  onClick={() => navigate("/payment")}
                  title="View Cart"
                  style={{
                    position: "relative",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    borderRadius: "50%",
                    width: "42px",
                    height: "42px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "background 0.25s, transform 0.25s",
                    flexShrink: 0,
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; e.currentTarget.style.transform = "scale(1.1)"; }}
                  onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = "scale(1)"; }}
                >
                  <span style={{ fontSize: "20px", lineHeight: 1 }}>🛒</span>
                  {cartCount > 0 && (
                    <span style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-4px",
                      background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                      color: "white",
                      borderRadius: "50%",
                      width: "18px",
                      height: "18px",
                      fontSize: "11px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid rgba(0,0,0,0.6)",
                      animation: "pulse 1.5s infinite",
                    }}>
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-full 
                bg-red-500/80 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;