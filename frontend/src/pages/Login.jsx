import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast("Please enter email and password", "error"); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast("Welcome back! Signed in successfully 👋", "success");
      navigate("/");
    } catch {
      toast("Invalid credentials. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 flex-1 flex items-center justify-center p-6 min-h-0 overflow-y-auto">
      <div className="w-full max-w-md py-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-base font-bold"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 4px 16px rgba(99,102,241,0.35)" }}
            >
              ⚡
            </div>
            <span
              className="font-syne font-extrabold text-3xl"
              style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}
            >
              Nearby
            </span>
          </div>
          <p className="text-slate-400 text-sm">Your hyperlocal task marketplace</p>
        </div>

        <GlassCard className="p-8 animate-fade-up">
          {/* Auth tabs */}
          <div
            className="flex mb-7 rounded-xl p-1"
            style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)" }}
          >
            {[
              { label: "Sign In", href: "/login", active: true },
              { label: "Register", href: "/register", active: false },
            ].map((tab) => (
              <Link
                key={tab.label}
                to={tab.href}
                className="flex-1 text-center py-2 rounded-lg text-[13px] font-medium transition-all duration-200"
                style={{
                  background: tab.active ? "rgba(255,255,255,0.90)" : "transparent",
                  color: tab.active ? "#6366f1" : "#94a3b8",
                  boxShadow: tab.active ? "0 1px 4px rgba(99,102,241,0.15)" : "none",
                  textDecoration: "none",
                  fontWeight: tab.active ? 600 : 400,
                }}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <FormInput
              label="Email Address"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-end">
              <button type="button" className="text-[12px] text-indigo-500 hover:text-indigo-700 transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-[14px] flex items-center justify-center gap-2 mt-1"
              style={{ opacity: loading ? 0.75 : 1 }}
            >
              {loading ? (
                <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Signing in...</>
              ) : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[12px] text-slate-400">or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Google */}
          <button
            onClick={() => { toast("Google OAuth coming soon!", "info"); }}
            className="btn-ghost w-full py-3 text-[13px] flex items-center justify-center gap-2.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-[12px] text-slate-400 mt-5">
            No account yet?{" "}
            <Link to="/register" className="text-indigo-500 hover:text-indigo-700 transition-colors font-medium">
              Create one free →
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}