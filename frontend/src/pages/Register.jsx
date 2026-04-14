import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", role: "both",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.firstName || !form.email || !form.password) {
    toast("Please fill all required fields", "error");
    return;
  }

  if (form.password.length < 6) {
    toast("Password must be at least 6 characters", "error");
    return;
  }

  setLoading(true);

  try {
    await register({
      name: `${form.firstName} ${form.lastName || ""}`.trim(),
      email: form.email,
      password: form.password,
      role: form.role,
    });

    toast("Welcome to Taskly! Account created 🎉", "success");
    navigate("/");
  } catch (err) {
    console.log(err.response?.data); // 🔥 debug helper
    toast("Registration failed. Please try again.", "error");
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
              Taskly
            </span>
          </div>
          <p className="text-slate-400 text-sm">Join thousands of local taskers</p>
        </div>

        <GlassCard className="p-8 animate-fade-up">
          {/* Tabs */}
          <div
            className="flex mb-7 rounded-xl p-1"
            style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)" }}
          >
            {[
              { label: "Sign In", href: "/login", active: false },
              { label: "Register", href: "/register", active: true },
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
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="First Name *" placeholder="Arjun" value={form.firstName} onChange={set("firstName")} required />
              <FormInput label="Last Name" placeholder="Joshi" value={form.lastName} onChange={set("lastName")} />
            </div>
            <FormInput label="Email Address *" type="email" placeholder="you@email.com" value={form.email} onChange={set("email")} required />
            <FormInput label="Password *" type="password" placeholder="Create a strong password" value={form.password} onChange={set("password")} required />

            <FormInput label="I want to" as="select" value={form.role} onChange={set("role")}>
              <option value="poster">Post tasks (I need help)</option>
              <option value="tasker">Complete tasks (I want to earn)</option>
              <option value="both">Both — post & complete tasks</option>
            </FormInput>

            {/* Role cards */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "poster", icon: "📋", label: "Task Poster" },
                { key: "tasker", icon: "⚡", label: "Tasker" },
                { key: "both",   icon: "🔁", label: "Both" },
              ].map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, role: r.key }))}
                  className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-[11px] font-medium border transition-all duration-200"
                  style={{
                    background: form.role === r.key ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.65)",
                    borderColor: form.role === r.key ? "rgba(99,102,241,0.40)" : "rgba(99,102,241,0.12)",
                    color: form.role === r.key ? "#6366f1" : "#64748b",
                    boxShadow: form.role === r.key ? "0 2px 8px rgba(99,102,241,0.12)" : "none",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{r.icon}</span>
                  {r.label}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-[14px] flex items-center justify-center gap-2 mt-1"
              style={{ opacity: loading ? 0.75 : 1 }}
            >
              {loading ? (
                <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Creating account...</>
              ) : "Create Account →"}
            </button>
          </form>

          <p className="text-center text-[12px] text-slate-400 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-500 hover:text-indigo-700 transition-colors font-medium">
              Sign in →
            </Link>
          </p>

          <p className="text-center text-[11px] text-slate-300 mt-3">
            By registering you agree to our Terms of Service & Privacy Policy
          </p>
        </GlassCard>
      </div>
    </div>
  );
}