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

type Role = "attendee" | "organizer";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("attendee");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

    if (!email || !password || !fullName) {
      setError("Please fill in all required fields.");
      return;
    }

    const names = fullName.trim().split(" ");
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ") || "User";

    setIsLoading(true);
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Layout>
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-wadu-navy dark:text-white mb-2">
              Create your account
            </h1>
            <p className="text-slate-550 dark:text-slate-400 font-semibold">
              Join WADU to start exploring or hosting events.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-7 shadow-md">
            {/* Role Selection */}
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                I want to join as an...
              </p>
              <div className="grid grid-cols-2 gap-4">
                {/* Attendee Card */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("attendee")}
                  className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200 ${
                    selectedRole === "attendee"
                      ? "border-wadu-purple bg-wadu-purple/5 dark:bg-wadu-purple/10 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-wadu-teal dark:hover:border-wadu-teal"
                  }`}
                >
                  {selectedRole === "attendee" && (
                    <CheckCircle2 size={16} className="absolute top-2.5 right-2.5 text-wadu-purple" />
                  )}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                      selectedRole === "attendee" ? "bg-wadu-purple text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    <User size={20} />
                  </div>
                  <div className="text-center">
                    <p className="text-wadu-navy dark:text-white font-bold text-sm">Attendee</p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 font-semibold">
                      Buy tickets &amp; explore events
                    </p>
                  </div>
                </button>

                {/* Organizer Card */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("organizer")}
                  className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200 ${
                    selectedRole === "organizer"
                      ? "border-wadu-teal bg-wadu-teal/5 dark:bg-wadu-teal/10 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-wadu-teal dark:hover:border-wadu-teal"
                  }`}
                >
                  {selectedRole === "organizer" && (
                    <CheckCircle2 size={16} className="absolute top-2.5 right-2.5 text-wadu-teal" />
                  )}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-200 ${
                      selectedRole === "organizer" ? "bg-wadu-teal text-wadu-navy font-bold" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    <Building2 size={20} />
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <p className="text-wadu-navy dark:text-white font-bold text-sm">Organizer</p>
                      <span className="text-[10px] bg-wadu-teal/10 text-wadu-teal border border-wadu-teal/30 px-1.5 py-px rounded-full font-bold">Pro</span>
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 font-semibold">
                      Manage events &amp; payouts
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 dark:border-slate-800" />

            {/* Registration Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-slate-550 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-550 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-wadu-teal" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 pl-11 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-550 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-wadu-teal" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 pl-11 pr-11 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-wadu-teal transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-wadu-navy border border-wadu-navy/15 text-white hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal py-3.5 rounded-xl font-bold transition duration-200 flex items-center justify-center gap-2 shadow-sm text-base"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                <span className="bg-white dark:bg-slate-900 px-3">Already have an account?</span>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/sign-in"
                className="inline-block w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-wadu-teal dark:hover:border-wadu-teal text-slate-700 dark:text-slate-200 py-3 rounded-xl text-sm font-bold transition duration-200"
              >
                Sign In Instead
              </Link>
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
