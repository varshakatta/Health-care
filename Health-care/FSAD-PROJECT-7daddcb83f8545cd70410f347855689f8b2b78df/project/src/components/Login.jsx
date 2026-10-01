import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const res = await axios.post("http://localhost:8081/api/auth/login", {
        username: username,
        password: password
      });

      if (res.data) {
        const userRole = res.data.role || "student";
        const finalUsername = res.data.username || username;
        const finalEmail = res.data.email || finalUsername;

        const mfaEnabled = res.data.mfaEnabled !== false;
        if (mfaEnabled) {
          localStorage.setItem("userEmail", finalEmail);
          localStorage.setItem("username", finalUsername);
          localStorage.setItem("userRole", userRole);
          if (res.data.mfaSetupRequired) {
            localStorage.setItem("qrCodeUrl", res.data.qrCodeUrl);
          } else {
            localStorage.removeItem("qrCodeUrl");
          }
          setMessage("MFA required. Check your authenticator app.");
          navigate("/mfa");
        } else {
          setIsLoggedIn(true);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", finalEmail);
          localStorage.setItem("username", finalUsername);
          localStorage.setItem("userRole", userRole);

          if (userRole === "admin") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }
      } else {
        setMessage("Invalid credentials");
      }

    } catch (error) {
      console.error(error);
      setMessage("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="absolute inset-0 bg-[url('/fit.jpg')] bg-cover bg-center opacity-20"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          </div>

          {message && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl mb-6">
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white"
            />

            <button className="w-full bg-blue-500 text-white py-3 rounded-xl">
              {isLoading ? 'Signing In...' : 'Login'}
            </button>

          </form>

          <p className="text-center mt-4 text-white">
            Don't have account? <Link to="/register">Register</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;