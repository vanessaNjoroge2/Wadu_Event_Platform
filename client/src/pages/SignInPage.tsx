import { Layout } from "@/components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
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
type Step = "auth" | "role";
type Role = "attendee" | "organizer" | null;

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState<Tab>("signin");
  const [step, setStep] = useState<Step>("auth");
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("role");
  };

  const handleRoleConfirm = () => {
    if (selectedRole === "organizer") {
      navigate("/organizer-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">

          {/* ── STEP 1: AUTH FORM ── */}
          {step === "auth" && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {tab === "signin" ? "Welcome back" : "Join WADU"}
                </h1>
                <p className="text-gray-400">
                  {tab === "signin"
                    ? "Sign in to access your tickets and events."
                    : "Create an account to discover and book events."}
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
                <div className="flex rounded-xl bg-slate-900 p-1 mb-8">
                  <button
                    onClick={() => setTab("signin")}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                      tab === "signin"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setTab("signup")}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                      tab === "signup"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                <form className="space-y-5" onSubmit={handleAuth}>
                  {tab === "signup" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Your name"
                        className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-300">Password</label>
                      {tab === "signin" && (
                        <Link to="#" className="text-purple-400 text-xs hover:text-purple-300">
                          Forgot password?
                        </Link>
                      )}
                    </div>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 pl-11 pr-11 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
                  >
                    {tab === "signin" ? "Sign In" : "Create Account"}
                    <ArrowRight size={18} />
                  </button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-xs text-gray-500">
                    <span className="bg-slate-800/50 px-3">or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setStep("role")}
                    className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-700 hover:border-slate-500 text-white py-2.5 rounded-xl text-sm font-medium transition"
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
                    onClick={() => setStep("role")}
                    className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-700 hover:border-slate-500 text-white py-2.5 rounded-xl text-sm font-medium transition"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>
                </div>
              </div>

              <p className="text-center text-gray-500 text-sm mt-6">
                By continuing, you agree to WADU's{" "}
                <Link to="/terms" className="text-purple-400 hover:text-purple-300">Terms of Service</Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link>.
              </p>
            </>
          )}

          {/* ── STEP 2: ROLE PICKER ── */}
          {step === "role" && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">How will you use WADU?</h1>
                <p className="text-gray-400">Choose your account type to access the right dashboard.</p>
              </div>

              <div className="space-y-4 mb-6">
                {/* Attendee */}
                <button
                  onClick={() => setSelectedRole("attendee")}
                  className={`w-full text-left rounded-2xl border-2 p-5 transition-all group ${
                    selectedRole === "attendee"
                      ? "border-purple-500 bg-purple-600/10"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition ${
                      selectedRole === "attendee" ? "bg-purple-600" : "bg-slate-700 group-hover:bg-slate-600"
                    }`}>
                      <User size={22} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-bold text-lg">Attendee</h3>
                        {selectedRole === "attendee" && (
                          <CheckCircle2 size={20} className="text-purple-400" />
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        Discover events, buy tickets, and manage your bookings from your personal dashboard.
                      </p>
                      <div className="flex gap-2 mt-3">
                        {["Browse Events", "Buy Tickets", "My Bookings"].map((f) => (
                          <span key={f} className="text-xs bg-slate-700 text-gray-300 px-2.5 py-1 rounded-full">{f}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Organizer */}
                <button
                  onClick={() => setSelectedRole("organizer")}
                  className={`w-full text-left rounded-2xl border-2 p-5 transition-all group ${
                    selectedRole === "organizer"
                      ? "border-[#00C2A8] bg-[#00C2A8]/10"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition ${
                      selectedRole === "organizer" ? "bg-[#00C2A8]" : "bg-slate-700 group-hover:bg-slate-600"
                    }`}>
                      <Building2 size={22} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-bold text-lg">Organizer</h3>
                          <span className="text-xs bg-[#00C2A8]/20 text-[#00C2A8] border border-[#00C2A8]/30 px-2 py-0.5 rounded-full font-semibold">Pro</span>
                        </div>
                        {selectedRole === "organizer" && (
                          <CheckCircle2 size={20} className="text-[#00C2A8]" />
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        Create and manage events, track ticket sales, view analytics, and handle payouts.
                      </p>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {["Create Events", "Analytics", "Payouts", "Attendees"].map((f) => (
                          <span key={f} className="text-xs bg-slate-700 text-gray-300 px-2.5 py-1 rounded-full">{f}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={handleRoleConfirm}
                disabled={!selectedRole}
                className={`w-full py-3.5 rounded-xl font-bold text-white transition flex items-center justify-center gap-2 ${
                  selectedRole
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                    : "bg-slate-700 cursor-not-allowed opacity-50"
                }`}
              >
                Continue to Dashboard
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => { setStep("auth"); setSelectedRole(null); }}
                className="w-full text-center text-gray-500 hover:text-gray-300 text-sm mt-4 transition"
              >
                ← Back to sign in
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
