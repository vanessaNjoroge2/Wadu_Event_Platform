import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft, Mail, Lock, KeyRound, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type Step = "request" | "reset" | "success";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Request Password Reset Code
  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    api.post("/auth/forgot-password", { email })
      .then(() => {
        toast({
          title: "Reset Code Sent",
          description: `We have sent a 6-digit password reset code to ${email}.`,
        });
        setStep("reset");
      })
      .catch((err: any) => {
        setError(err.message || "Failed to send reset code.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Step 2: Reset Password with Code & New Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    api.post("/auth/reset-password", { email, code, newPassword })
      .then(() => {
        toast({
          title: "Password Reset Successful",
          description: "Your password has been reset. You can now sign in.",
        });
        setStep("success");
      })
      .catch((err: any) => {
        setError(err.message || "Invalid code or failed to reset password.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Back link */}
          <Link
            to="/sign-in"
            className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-wadu-teal dark:hover:text-wadu-teal mb-8 font-bold transition duration-200"
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-md">
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            {step === "request" && (
              <form onSubmit={handleRequestCode} className="space-y-6">
                <div className="text-center">
                  <p className="text-wadu-purple font-extrabold text-xs uppercase tracking-widest mb-2">
                    Account Recovery
                  </p>
                  <h1 className="text-3xl font-extrabold text-wadu-navy dark:text-white">
                    Forgot your password?
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm mt-2">
                    Enter your registered email address and we will send you a 6-digit reset code.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-wadu-teal" />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 pl-11 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-wadu-purple text-white hover:bg-wadu-teal hover:text-wadu-navy py-3.5 rounded-xl font-bold transition duration-200 shadow-sm text-sm disabled:opacity-50"
                >
                  {isLoading ? "Sending Code..." : "Send Reset Code"}
                </button>
              </form>
            )}

            {step === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="text-center">
                  <p className="text-wadu-purple font-extrabold text-xs uppercase tracking-widest mb-2">
                    Reset Password
                  </p>
                  <h1 className="text-2xl font-extrabold text-wadu-navy dark:text-white">
                    Enter Code & New Password
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm mt-2">
                    We sent a 6-digit reset code to <span className="font-bold text-slate-800 dark:text-white">{email}</span>.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                    6-Digit Reset Code
                  </label>
                  <div className="relative">
                    <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-wadu-teal" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="123456"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 pl-11 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-bold text-center tracking-widest text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-wadu-teal" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 pl-11 pr-11 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-wadu-navy text-white hover:bg-wadu-teal hover:text-wadu-navy py-3.5 rounded-xl font-bold transition duration-200 shadow-sm text-sm disabled:opacity-50"
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep("request")}
                    className="text-xs text-wadu-teal hover:underline font-bold"
                  >
                    Resend Code to {email}
                  </button>
                </div>
              </form>
            )}

            {step === "success" && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-wadu-teal/10 border border-wadu-teal flex items-center justify-center mx-auto">
                  <CheckCircle2 className="text-wadu-teal" size={32} />
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl font-extrabold text-wadu-navy dark:text-white">
                    Password Reset Complete
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">
                    Your password has been successfully updated. You can now sign in with your new password.
                  </p>
                </div>

                <Link
                  to="/sign-in"
                  className="block w-full bg-wadu-navy text-white hover:bg-wadu-teal hover:text-wadu-navy py-3.5 rounded-xl font-bold transition duration-200 text-sm shadow-sm text-center"
                >
                  Sign In Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
