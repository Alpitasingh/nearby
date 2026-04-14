/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        dm: ["DM Sans", "sans-serif"],
      },
      backgroundImage: {
        "gradient-app": "linear-gradient(135deg,#eef0f8 0%,#f0f2fb 50%,#f4f0fb 100%)",
        "gradient-primary": "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)",
        "gradient-btn": "linear-gradient(135deg,#6366f1,#8b5cf6)",
        "gradient-btn-hover": "linear-gradient(135deg,#4f46e5,#7c3aed)",
      },
      boxShadow: {
        glow: "0 4px 24px rgba(99,102,241,0.25)",
        "glow-violet": "0 4px 24px rgba(139,92,246,0.25)",
        card: "0 2px 20px rgba(99,102,241,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 28px rgba(99,102,241,0.10), 0 1px 6px rgba(0,0,0,0.05)",
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        "float-delay": "float 8s ease-in-out -3s infinite",
        "float-slow": "float 10s ease-in-out -5s infinite",
        "slide-in": "slideIn 0.3s ease forwards",
        "fade-up": "fadeUp 0.35s ease forwards",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0) scale(1)" }, "50%": { transform: "translateY(-20px) scale(1.05)" } },
        slideIn: { from: { transform: "translateX(110%)", opacity: "0" }, to: { transform: "translateX(0)", opacity: "1" } },
        fadeUp: { from: { transform: "translateY(14px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
      },
    },
  },
  plugins: [],
};