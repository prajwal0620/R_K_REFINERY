import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const res = await login(username.trim(), password);
    setSubmitting(false);
    if (!res.success) {
      setError(res.message || "Login failed");
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rk-accentSoft via-white to-slate-50 flex items-center justify-center px-4">
      <div className="relative overflow-hidden max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-soft">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rk-primary to-rk-accent" />
        <div className="text-center mb-5 mt-1">
          <div className="text-[11px] tracking-[0.18em] uppercase text-slate-500">
            BILLING MANAGEMENT
          </div>
          <div className="text-lg font-semibold text-slate-900 mt-1">
            R.K. Refinery – Silver Exchange
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Please login to access Billing Dashboard.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block text-xs text-slate-700 mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-rk-primary focus:ring-1 focus:ring-rk-primary"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-rk-primary focus:ring-1 focus:ring-rk-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
            />
          </div>

          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-rk-primary to-rk-accent text-slate-900 font-medium text-sm py-2 rounded-md hover:from-rk-primaryDark hover:to-rk-accent transition-colors disabled:opacity-70"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>

          <div className="text-[11px] text-slate-500 text-center mt-1">
            Default: <span className="font-mono">admin / admin123</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;