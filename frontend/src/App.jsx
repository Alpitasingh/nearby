import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import BgOrbs from "./components/BgOrbs";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostTask from "./pages/PostTask";
import TaskDetails from "./pages/TaskDetails";
import Profile from "./pages/Profile";

export default function App() {
  // ✅ NO DUMMY DATA
  const [tasks, setTasks] = useState([]);

  // ✅ POST HANDLER (REAL TIME ADD)
  const handlePost = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <div className="flex flex-col h-screen overflow-hidden relative">
            <BgOrbs />
            <Navbar />

            <Routes>
              <Route
                path="/"
                element={<Home tasks={tasks} setTasks={setTasks} />}
              />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/task/:id"
                element={<TaskDetails tasks={tasks} />}
              />

              <Route
                path="/post"
                element={
                  <ProtectedRoute>
                    <PostTask onPost={handlePost} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile tasks={tasks} />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <div className="relative z-10 flex-1 flex items-center justify-center">
                    <div className="text-center glass p-14 rounded-3xl">
                      <div className="font-syne font-extrabold text-7xl grad-text mb-4">
                        404
                      </div>
                      <h2 className="font-syne font-bold text-xl mb-3 text-white">
                        Page not found
                      </h2>
                      <a
                        href="/"
                        className="btn-primary px-6 py-3 text-sm inline-block mt-2"
                      >
                        Go Home
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}