import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "both",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔥 IMPORTANT FIX (backend expects name, not firstName/lastName)
      const payload = {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      const res = await api.post("/auth/register", payload);

      // ✅ save token
      localStorage.setItem("taskly_token", res.data.token);
      localStorage.setItem("taskly_user", JSON.stringify(res.data.user));

      toast("Account created successfully 🎉", "success");

      navigate("/");
    } catch (err) {
      console.log("FULL ERROR 👉", err.response?.data); // 🔥 DEBUG

      toast(
        err.response?.data?.message ||
          "Registration failed. Please try again.",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl w-full max-w-md"
      >
        {/* UI SAME */}
        <h2 className="text-xl font-semibold mb-4 text-center">
          Create Account
        </h2>

        <div className="flex gap-2 mb-3">
          <input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className="w-1/2 p-2 rounded-lg border"
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="w-1/2 p-2 rounded-lg border"
            required
          />
        </div>

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded-lg border"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded-lg border"
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded-lg border"
        >
          <option value="both">Both — post & complete tasks</option>
          <option value="poster">Task Poster</option>
          <option value="worker">Tasker</option>
        </select>

        <button className="w-full bg-purple-600 text-white py-2 rounded-lg">
          Create Account →
        </button>
      </form>
    </div>
  );
}