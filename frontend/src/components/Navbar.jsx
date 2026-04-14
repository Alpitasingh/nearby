import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast("Signed out successfully", "info");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 border-none cursor-pointer font-dm ${
      isActive
        ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/70"
    }`;

  return (
    <nav
      className="relative z-50 flex items-center gap-3 px-6 py-3 border-b"
      style={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottomColor: "rgba(99,102,241,0.12)",
        boxShadow: "0 1px 0 rgba(255,255,255,0.8), 0 2px 12px rgba(99,102,241,0.05)",
      }}
    >
      {/* Logo */}
      <NavLink to="/" className="mr-2 flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
        >
          ⚡
        </div>
        <span
          className="font-syne font-extrabold text-[18px]"
          style={{
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Nearby
        </span>
      </NavLink>

      {/* Nav links */}
      <div className="flex gap-1 flex-1">
        <NavLink to="/" end className={linkClass}>Explore</NavLink>
        <NavLink to="/post" className={linkClass}>Post Task</NavLink>
        {user && <NavLink to="/profile" className={linkClass}>Profile</NavLink>}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2.5">
        {user ? (
          <>
            <button
              onClick={handleLogout}
              className="btn-ghost px-4 py-2 text-[13px]"
            >
              Sign Out
            </button>
            <NavLink to="/profile">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold cursor-pointer font-syne text-white transition-all duration-200 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  boxShadow: "0 2px 8px rgba(99,102,241,0.35)",
                }}
              >
                {user.initials}
              </div>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) =>
              `btn-ghost px-4 py-2 text-[13px] ${isActive ? "border-indigo-200 text-indigo-600" : ""}`
            }>
              Sign In
            </NavLink>
            <NavLink to="/register">
              <button className="btn-primary px-4 py-2 text-[13px]">Get Started</button>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}