import { Layout } from "@/components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  User,
  Building2,
  CheckCircle2,
} from "lucide-react";

type Tab = "signin" | "signup";
type Role = "attendee" | "organizer";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState<Tab>("signin");
  const [selectedRole, setSelectedRole] = useState<Role>("attendee");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      const role = (localStorage.getItem("userRole") || "attendee").toLowerCase();
      if (role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else if (role === "organizer") {
        navigate("/organizer-dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (tab === "signup" && !fullName)) {
      setError("Please fill in all required fields.");
      return;
    }

    if (tab === "signup") {
      const names = fullName.trim().split(" ");
      const firstName = names[0] || "";
      const lastName = names.slice(1).join(" ") || "User";

      api.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
        role: selectedRole.toUpperCase(),
      })
        .then((data: any) => {
          localStorage.setItem("verify_email", email);
          navigate("/verify-email");
        })
        .catch((err: any) => {
          setError(err.message || "Failed to register.");
        });
      return;
    }

    api.post("/auth/login", {
      email,
      password,
    })
      .then((data: any) => {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);

        if (data.user.role === "ADMIN") {
          navigate("/admin-dashboard");
        } else if (data.user.role === "ORGANIZER") {
          navigate("/organizer-dashboard");
        } else {
          navigate("/dashboard");
        }
      })
      .catch((err: any) => {
        if (err.message && err.message.toLowerCase().includes("verify your email")) {
          localStorage.setItem("verify_email", email);
          navigate("/verify-email");
        } else {
          setError(err.message || "Invalid email or password.");
        }
      });
  };

  return (
    <Layout>
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-wadu-navy dark:text-white mb-2">
              {tab === "signin" ? "Welcome back" : "Join WADU"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-semibold">
              {tab === "signin"
                ? "Sign in to access your account."
                : "Create an account to get started."}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-7 shadow-md">

            {/* ── STEP 1: ROLE SELECTION (always visible) ── */}
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                I am signing in as a…
              </p>
              <div className="grid grid-cols-2 gap-4">
                {/* Attendee */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("attendee")}
                  className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200 ${selectedRole === "attendee"
                      ? "border-wadu-purple bg-wadu-purple/5 dark:bg-wadu-purple/10 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-wadu-teal dark:hover:border-wadu-teal"
                    }`}
                >
                  {selectedRole === "attendee" && (
                    <CheckCircle2 size={16} className="absolute top-2.5 right-2.5 text-wadu-purple" />
                  )}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-200 ${selectedRole === "attendee" ? "bg-wadu-purple text-white" : "bg-slate-100 dark:bg-slate-850 text-slate-500"
                    }`}>
                    <User size={20} />
                  </div>
                  <div className="text-center">
                    <p className="text-wadu-navy dark:text-white font-bold text-sm">Attendee</p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 font-semibold">Buy tickets & explore events</p>
                  </div>
                </button>

                {/* Organizer */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("organizer")}
                  className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200 ${selectedRole === "organizer"
                      ? "border-wadu-teal bg-wadu-teal/5 dark:bg-wadu-teal/10 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-wadu-teal dark:hover:border-wadu-teal"
                    }`}
                >
                  {selectedRole === "organizer" && (
                    <CheckCircle2 size={16} className="absolute top-2.5 right-2.5 text-wadu-teal" />
                  )}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-200 ${selectedRole === "organizer" ? "bg-wadu-teal text-wadu-navy font-bold" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}>
                    <Building2 size={20} />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <p className="text-wadu-navy dark:text-white font-bold text-sm">Organizer</p>
                      <span className="text-[10px] bg-wadu-teal/10 text-wadu-teal border border-wadu-teal/30 px-1.5 py-px rounded-full font-bold">Pro</span>
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 font-semibold">Manage events & payouts</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 dark:border-slate-800" />

            {/* ── STEP 2: AUTH TABS ── */}
            <div>
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-950 p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setTab("signin")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition duration-200 ${tab === "signin"
                      ? "bg-wadu-purple text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-wadu-teal dark:hover:text-wadu-teal"
                    }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setTab("signup")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition duration-200 ${tab === "signup"
                      ? "bg-wadu-purple text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-wadu-teal dark:hover:text-wadu-teal"
                    }`}
                >
                  Sign Up
                </button>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}

                {tab === "signup" && (
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-medium"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-wadu-teal" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 pl-11 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Password</label>
                    {tab === "signin" && (
                      <Link to="/forgot-password" className="text-xs text-wadu-teal hover:underline font-semibold">
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-wadu-teal" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 pl-11 pr-11 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-450 hover:text-wadu-teal transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-wadu-navy border border-wadu-navy/15 text-white hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal py-3.5 rounded-xl font-bold transition duration-200 flex items-center justify-center gap-2 shadow-sm text-base"
                >
                  {tab === "signin" ? `Sign In as ${selectedRole === "organizer" ? "Organizer" : "Attendee"}` : "Create Account"}
                  <ArrowRight size={18} />
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  <span className="bg-white dark:bg-slate-900 px-3">or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleSubmit as any}
                  className="flex items-center justify-center gap-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-wadu-teal dark:hover:border-wadu-teal text-slate-700 dark:text-slate-200 py-2.5 rounded-xl text-sm font-bold transition duration-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={handleSubmit as any}
                  className="flex items-center justify-center gap-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-wadu-teal dark:hover:border-wadu-teal text-slate-700 dark:text-slate-200 py-2.5 rounded-xl text-sm font-bold transition duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-6 font-semibold">
            By continuing, you agree to WADU's{" "}
            <Link to="/terms" className="text-wadu-purple font-bold hover:text-wadu-teal transition">Terms of Service</Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-wadu-purple font-bold hover:text-wadu-teal transition">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </Layout>
  );
}
