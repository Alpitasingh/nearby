export default function BgOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Top-left indigo orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: 520, height: 520,
          background: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, rgba(139,92,246,0.07) 50%, transparent 70%)",
          filter: "blur(60px)",
          top: -160, left: -160,
          animation: "float 9s ease-in-out infinite",
        }}
      />
      {/* Right violet orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: 380, height: 380,
          background: "radial-gradient(circle, rgba(168,85,247,0.11) 0%, rgba(139,92,246,0.05) 50%, transparent 70%)",
          filter: "blur(70px)",
          top: "40%", right: -80,
          animation: "float 9s ease-in-out -3.5s infinite",
        }}
      />
      {/* Bottom blue orb */}
      <div
        className="absolute rounded-full"
        style={{
          width: 440, height: 440,
          background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(99,102,241,0.05) 50%, transparent 70%)",
          filter: "blur(80px)",
          bottom: -140, left: "30%",
          animation: "float 11s ease-in-out -5.5s infinite",
        }}
      />
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
          opacity: 0.4,
        }}
      />
    </div>
  );
}