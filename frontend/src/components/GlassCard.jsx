export default function GlassCard({ children, className = "", hover = true, onClick, style = {} }) {
  return (
    <div
      onClick={onClick}
      className={`glass ${hover ? "" : "hover:bg-white/[0.06] hover:border-white/[0.12]"} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
