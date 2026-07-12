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
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-24 bg-wadu-yellow">
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-display font-black text-wadu-black mb-4 uppercase">
              Create your account
            </h1>
            <p className="text-wadu-black font-bold uppercase text-xl">
              Join WADU to start exploring or hosting events.
            </p>
          </div>

          <div className="bg-white border-8 border-wadu-black p-8 md:p-12 space-y-10 shadow-[16px_16px_0px_0px_rgba(5,5,5,1)]">
            {/* Role Selection */}
            <div>
              <p className="text-lg font-black text-wadu-black mb-4 uppercase tracking-widest bg-wadu-yellow border-2 border-wadu-black inline-block px-3 py-1">
                I want to join as an...
              </p>
              <div className="grid grid-cols-2 gap-6">
                {/* Attendee Card */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("attendee")}
                  className={`relative flex flex-col items-center gap-4 p-6 rounded-none border-4 transition-all duration-200 ${
                    selectedRole === "attendee"
                      ? "border-wadu-black bg-wadu-yellow shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] translate-y-1 translate-x-1"
                      : "border-wadu-black bg-white hover:bg-wadu-black hover:text-wadu-yellow shadow-[8px_8px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1"
                  }`}
                >
                  {selectedRole === "attendee" && (
                    <CheckCircle2 size={24} className="absolute top-4 right-4 text-wadu-black" />
                  )}
                  <div
                    className={`w-16 h-16 rounded-none border-4 border-wadu-black flex items-center justify-center transition-colors duration-200 ${
                      selectedRole === "attendee" ? "bg-wadu-black text-wadu-yellow" : "bg-white text-wadu-black"
                    }`}
                  >
                    <User size={32} />
                  </div>
                  <div className="text-center">
                    <p className={`font-black text-xl uppercase ${selectedRole === "attendee" ? "text-wadu-black" : "text-wadu-black group-hover:text-wadu-yellow"}`}>Attendee</p>
                  </div>
                </button>

                {/* Organizer Card */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("organizer")}
                  className={`relative flex flex-col items-center gap-4 p-6 rounded-none border-4 transition-all duration-200 ${
                    selectedRole === "organizer"
                      ? "border-wadu-black bg-wadu-yellow shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] translate-y-1 translate-x-1"
                      : "border-wadu-black bg-white hover:bg-wadu-black hover:text-wadu-yellow shadow-[8px_8px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1"
                  }`}
                >
                  {selectedRole === "organizer" && (
                    <CheckCircle2 size={24} className="absolute top-4 right-4 text-wadu-black" />
                  )}
                  <div
                    className={`w-16 h-16 rounded-none border-4 border-wadu-black flex items-center justify-center transition-colors duration-200 ${
                      selectedRole === "organizer" ? "bg-wadu-black text-wadu-yellow" : "bg-white text-wadu-black"
                    }`}
                  >
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

            {/* Registration Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-wadu-yellow border-4 border-wadu-black text-wadu-black text-lg font-black uppercase px-6 py-4 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-wadu-black text-sm font-black uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="YOUR NAME"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border-4 border-wadu-black rounded-none px-4 py-4 text-wadu-black font-black uppercase placeholder-wadu-black/40 focus:outline-none focus:bg-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                  required
                />
              </div>

              <div>
                <label className="block text-wadu-black text-sm font-black uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-wadu-black" />
                  <input
                    type="email"
                    placeholder="YOU@EXAMPLE.COM"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border-4 border-wadu-black rounded-none px-4 py-4 pl-14 text-wadu-black font-black uppercase placeholder-wadu-black/40 focus:outline-none focus:bg-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-wadu-black text-sm font-black uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-wadu-black" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border-4 border-wadu-black rounded-none px-4 py-4 pl-14 pr-14 text-wadu-black font-black uppercase placeholder-wadu-black/40 focus:outline-none focus:bg-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]"
                    required
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
                disabled={isLoading}
                className="w-full bg-wadu-black border-4 border-wadu-black text-wadu-yellow hover:bg-white hover:text-wadu-black py-4 font-black uppercase transition duration-200 flex items-center justify-center gap-3 text-xl shadow-[8px_8px_0px_0px_rgba(5,5,5,0.2)] hover:-translate-y-1 hover:-translate-x-1 disabled:opacity-50"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
                <ArrowRight size={24} />
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-4 border-wadu-black" />
              </div>
              <div className="relative flex justify-center text-sm text-wadu-black font-black uppercase tracking-widest">
                <span className="bg-white px-4 border-4 border-wadu-black shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]">Already have an account?</span>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/sign-in"
                className="inline-block w-full bg-wadu-yellow border-4 border-wadu-black text-wadu-black py-4 text-xl font-black uppercase hover:bg-wadu-black hover:text-wadu-yellow transition duration-200 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(5,5,5,1)]"
              >
                Sign In Instead
              </Link>
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
