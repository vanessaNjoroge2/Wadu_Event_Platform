import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [state, setState] = useState<"request" | "sent">("request");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setState("sent");
    }
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
            {state === "request" ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                  <p className="text-wadu-purple font-extrabold text-xs uppercase tracking-widest mb-2">
                    Account Recovery
                  </p>
                  <h1 className="text-3xl font-extrabold text-wadu-navy dark:text-white">
                    Forgot your password?
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm mt-2">
                    Enter your email and we'll send you a reset link.
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
                  className="w-full bg-wadu-purple text-white hover:bg-wadu-teal hover:text-wadu-navy py-3.5 rounded-xl font-bold transition duration-200 shadow-sm text-sm"
                >
                  Send Reset Link
                </button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-wadu-teal/10 border border-wadu-teal flex items-center justify-center mx-auto">
                  <CheckCircle2 className="text-wadu-teal" size={32} />
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl font-extrabold text-wadu-navy dark:text-white">
                    Check your email
                  </h1>
                  <p className="text-slate-550 dark:text-slate-400 font-semibold text-sm">
                    We've sent a password reset link to <span className="text-wadu-navy dark:text-white font-bold">{email}</span>. It expires in 15 minutes.
                  </p>
                </div>

                <Link
                  to="/sign-in"
                  className="block w-full bg-wadu-navy text-white hover:bg-wadu-teal hover:text-wadu-navy py-3.5 rounded-xl font-bold transition duration-200 text-sm shadow-sm"
                >
                  Back to Sign In
                </Link>

                <p className="text-xs text-slate-400 font-semibold">
                  Didn't receive it?{" "}
                  <button
                    type="button"
                    onClick={() => setState("request")}
                    className="text-wadu-teal hover:underline font-bold"
                  >
                    Resend
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
