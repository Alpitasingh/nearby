import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import FormInput from "../components/FormInput";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { BADGE_MAP } from "../data/tasks";

const INITIAL = {
  title: "", cat: "", budget: "", description: "",
  location: "", urgency: "low", skills: "",
};

export default function PostTask({ onPost }) {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast("Please sign in to post a task", "error"); navigate("/login"); return; }
    if (!form.title || !form.cat || !form.budget || !form.description || !form.location) {
      toast("Please fill all required fields", "error"); return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const newTask = {
      id: Date.now(),
      title: form.title,
      cat: form.cat,
      badge: BADGE_MAP[form.cat] || "badge-purple",
      price: parseInt(form.budget, 10),
      dist: "0.1 km",
      timeAgo: "Just now",
      urgency: form.urgency,
      userInitials: user.initials,
      userName: user.name,
      userRating: user.rating || 5.0,
      description: form.description,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      offers: 0,
      views: 1,
      location: form.location,
      postedDate: `Today, ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`,
    };

    onPost(newTask);
    toast("Task posted successfully! 🚀", "success");
    setLoading(false);
    setForm(INITIAL);
    setTimeout(() => navigate("/"), 800);
  };

  return (
    <div className="relative z-10 flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-syne font-extrabold text-3xl text-slate-900 mb-2">Post a New Task</h1>
          <p className="text-slate-400 text-sm">Tell local taskers exactly what you need done.</p>
        </div>

        <GlassCard className="p-8 animate-fade-up">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Title */}
            <FormInput
              label="Task Title *"
              placeholder="e.g. Fix my React component performance issue"
              value={form.title}
              onChange={set("title")}
              required
            />

            {/* Category + Budget */}
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Category *" as="select" value={form.cat} onChange={set("cat")} required>
                <option value="">Select category</option>
                {["Tech","Design","Delivery","Cleaning","Tutoring","Moving"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </FormInput>
              <FormInput
                label="Budget (₹) *"
                type="number"
                placeholder="2500"
                value={form.budget}
                onChange={set("budget")}
                min="50"
                step="50"
                required
              />
            </div>

            {/* Description */}
            <FormInput
              label="Description *"
              as="textarea"
              placeholder="Describe what you need, any requirements, deadlines, or special instructions..."
              value={form.description}
              onChange={set("description")}
              required
            />

            {/* Location + Urgency */}
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Location *"
                placeholder="e.g. Koramangala, Bengaluru"
                value={form.location}
                onChange={set("location")}
                required
              />
              <FormInput label="Urgency" as="select" value={form.urgency} onChange={set("urgency")}>
                <option value="low">🟢 Flexible</option>
                <option value="med">🟡 Within a week</option>
                <option value="hot">🔴 Urgent (24h)</option>
              </FormInput>
            </div>

            {/* Skills */}
            <FormInput
              label="Skills Required"
              placeholder="e.g. React, Node.js, Figma (comma-separated)"
              value={form.skills}
              onChange={set("skills")}
            />

            {/* Budget preview */}
            {form.budget && (
              <div
                className="flex items-center justify-between px-5 py-4 rounded-xl border animate-fade-up"
                style={{
                  background: "rgba(99,102,241,0.05)",
                  borderColor: "rgba(99,102,241,0.20)",
                }}
              >
                <span className="text-sm text-slate-500">You'll be charged</span>
                <span
                  className="font-syne font-extrabold text-2xl"
                  style={{
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}
                >
                  ₹{parseInt(form.budget || 0).toLocaleString("en-IN")}
                </span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-[15px] flex items-center justify-center gap-2"
              style={{ opacity: loading ? 0.75 : 1 }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Task →"
              )}
            </button>

          </form>
        </GlassCard>

        {/* Tips */}
        <GlassCard className="p-5 mt-5 animate-fade-up" style={{ animationDelay: "120ms" }} hover={false}>
          <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest mb-3">💡 Tips for better responses</div>
          <ul className="text-[13px] text-slate-500 flex flex-col gap-2">
            {[
              "Be specific about deliverables and deadlines",
              "Mention any tools or skills required upfront",
              "Set a fair budget — it attracts quality taskers faster",
              "Include your location for hyperlocal tasks",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">▸</span> {tip}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}