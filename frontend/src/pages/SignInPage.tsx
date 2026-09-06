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
        navigate("/explore", { replace: true });
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
          if (data?.user?.devCode) {
            localStorage.setItem("dev_code", data.user.devCode);
          } else {
            localStorage.removeItem("dev_code");
          }
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
          navigate("/explore");
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
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-24 bg-wadu-yellow">
        <div className="w-full max-w-xl">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-display font-black text-wadu-black mb-4 uppercase">
              {tab === "signin" ? "Welcome back" : "Join WADU"}
            </h1>
            <p className="text-wadu-black font-bold uppercase text-xl">
              {tab === "signin"
                ? "Sign in to access your account."
                : "Create an account to get started."}
            </p>
          </div>

          <div className="bg-white border-8 border-wadu-black p-8 md:p-12 space-y-10 shadow-[16px_16px_0px_0px_rgba(5,5,5,1)]">

            {/* ── STEP 1: ROLE SELECTION (always visible) ── */}
            <div>
              <p className="text-lg font-black text-wadu-black mb-4 uppercase tracking-widest bg-wadu-yellow border-2 border-wadu-black inline-block px-3 py-1">
                I am signing in as...
              </p>
              <div className="grid grid-cols-2 gap-6">
                {/* Attendee */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("attendee")}
                  className={`relative flex flex-col items-center gap-4 p-6 rounded-none border-4 transition-all duration-200 ${selectedRole === "attendee"
                      ? "border-wadu-black bg-wadu-yellow shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] translate-y-1 translate-x-1"
                      : "border-wadu-black bg-white hover:bg-wadu-black hover:text-wadu-yellow shadow-[8px_8px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1"
                    }`}
                >
                  {selectedRole === "attendee" && (
                    <CheckCircle2 size={24} className="absolute top-4 right-4 text-wadu-black" />
                  )}
                  <div className={`w-16 h-16 rounded-none border-4 border-wadu-black flex items-center justify-center transition-colors duration-200 ${selectedRole === "attendee" ? "bg-wadu-black text-wadu-yellow" : "bg-white text-wadu-black"
                    }`}>
                    <User size={32} />
                  </div>
                  <div className="text-center">
                    <p className={`font-black text-xl uppercase ${selectedRole === "attendee" ? "text-wadu-black" : "text-wadu-black group-hover:text-wadu-yellow"}`}>Attendee</p>
                  </div>
                </button>

                {/* Organizer */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("organizer")}
                  className={`relative flex flex-col items-center gap-4 p-6 rounded-none border-4 transition-all duration-200 ${selectedRole === "organizer"
                      ? "border-wadu-black bg-wadu-yellow shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] translate-y-1 translate-x-1"
                      : "border-wadu-black bg-white hover:bg-wadu-black hover:text-wadu-yellow shadow-[8px_8px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1"
                    }`}
                >
                  {selectedRole === "organizer" && (
                    <CheckCircle2 size={24} className="absolute top-4 right-4 text-wadu-black" />
                  )}
                  <div className={`w-16 h-16 rounded-none border-4 border-wadu-black flex items-center justify-center transition-colors duration-200 ${selectedRole === "organizer" ? "bg-wadu-black text-wadu-yellow" : "bg-white text-wadu-black"
                    }`}>
                    <Building2 size={32} />
                  </div>
                  <div className="text-center">
                    <p className={`font-black text-xl uppercase ${selectedRole === "organizer" ? "text-wadu-black" : "text-wadu-black group-hover:text-wadu-yellow"}`}>Organizer</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-8 border-wadu-black" />

            {/* ── STEP 2: AUTH TABS ── */}
            <div>
              <div className="flex bg-white border-4 border-wadu-black mb-8">
                <button
                  type="button"
                  onClick={() => setTab("signin")}
                  className={`flex-1 py-4 text-xl font-black uppercase transition duration-200 ${tab === "signin"
                      ? "bg-wadu-black text-wadu-yellow"
                      : "text-wadu-black hover:bg-wadu-yellow"
                    }`}
                >
                  Sign In
                </button>
                <div className="w-1 bg-wadu-black" />
                <button
                  type="button"
                  onClick={() => setTab("signup")}
                  className={`flex-1 py-4 text-xl font-black uppercase transition duration-200 ${tab === "signup"
                      ? "bg-wadu-black text-wadu-yellow"
                      : "text-wadu-black hover:bg-wadu-yellow"
                    }`}
                >
                  Sign Up
                </button>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-wadu-yellow border-4 border-wadu-black text-wadu-black text-lg font-black uppercase px-6 py-4 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]">
                    {error}
                  </div>
                )}

                {tab === "signup" && (
                  <div>
                    <label className="block text-wadu-black text-sm font-black uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="YOUR NAME"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border-4 border-wadu-black rounded-none px-4 py-4 text-wadu-black font-black uppercase placeholder-wadu-black/40 focus:outline-none focus:bg-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-wadu-black text-sm font-black uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-wadu-black" />
                    <input
                      type="email"
                      placeholder="YOU@EXAMPLE.COM"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border-4 border-wadu-black rounded-none px-4 py-4 pl-14 text-wadu-black font-black uppercase placeholder-wadu-black/40 focus:outline-none focus:bg-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block text-wadu-black text-sm font-black uppercase tracking-wider">Password</label>
                    {tab === "signin" && (
                      <Link to="/forgot-password" className="text-sm text-wadu-black bg-wadu-yellow border-2 border-wadu-black px-2 uppercase hover:bg-wadu-black hover:text-wadu-yellow font-black transition">
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Lock size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-wadu-black" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border-4 border-wadu-black rounded-none px-4 py-4 pl-14 pr-14 text-wadu-black font-black uppercase placeholder-wadu-black/40 focus:outline-none focus:bg-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-wadu-black hover:text-wadu-yellow bg-white hover:bg-wadu-black border-2 border-wadu-black p-1 transition"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-wadu-black border-4 border-wadu-black text-wadu-yellow hover:bg-white hover:text-wadu-black py-4 font-black uppercase transition duration-200 flex items-center justify-center gap-3 text-xl shadow-[8px_8px_0px_0px_rgba(5,5,5,0.2)] hover:-translate-y-1 hover:-translate-x-1"
                >
                  {tab === "signin" ? `Sign In as ${selectedRole === "organizer" ? "Organizer" : "Attendee"}` : "Create Account"}
                  <ArrowRight size={24} />
                </button>
              </form>

              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-4 border-wadu-black" />
                </div>
                <div className="relative flex justify-center text-sm text-wadu-black font-black uppercase tracking-widest">
                  <span className="bg-white px-4 border-4 border-wadu-black shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]">or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={handleSubmit as any}
                  className="flex items-center justify-center gap-3 bg-white border-4 border-wadu-black hover:bg-wadu-yellow text-wadu-black py-4 text-lg font-black uppercase transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(5,5,5,1)]"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                  className="flex items-center justify-center gap-3 bg-white border-4 border-wadu-black hover:bg-wadu-yellow text-wadu-black py-4 text-lg font-black uppercase transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(5,5,5,1)]"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-wadu-black text-sm mt-8 font-black uppercase">
            By continuing, you agree to WADU's{" "}
            <Link to="/terms" className="text-wadu-black bg-white px-2 border-2 border-wadu-black hover:bg-wadu-black hover:text-wadu-yellow transition">Terms of Service</Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-wadu-black bg-white px-2 border-2 border-wadu-black hover:bg-wadu-black hover:text-wadu-yellow transition">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </Layout>
  );
}
