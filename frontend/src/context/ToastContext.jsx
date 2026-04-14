import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3800);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-20 right-5 z-50 flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-slide-in pointer-events-auto px-4 py-3 rounded-xl backdrop-blur-xl text-sm font-medium max-w-xs flex items-center gap-2.5"
            style={{
              background: t.type === "error"
                ? "rgba(254,242,242,0.95)"
                : t.type === "info"
                ? "rgba(239,246,255,0.95)"
                : "rgba(240,253,249,0.95)",
              border: `1px solid ${t.type === "error" ? "rgba(239,68,68,0.25)" : t.type === "info" ? "rgba(59,130,246,0.25)" : "rgba(16,185,129,0.25)"}`,
              color: t.type === "error" ? "#dc2626" : t.type === "info" ? "#2563eb" : "#059669",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <span style={{ fontSize: 15 }}>
              {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}