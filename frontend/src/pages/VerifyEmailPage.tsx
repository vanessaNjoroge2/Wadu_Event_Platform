import { Layout } from "@/components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export default function VerifyEmailPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const email = localStorage.getItem("verify_email") || "";

  // React Query mutation for code verification
  const verifyMutation = useMutation({
    mutationFn: (variables: { email: string; code: string }) => {
      return api.post<{ token: string; user: { id: string; role: string } }>("/auth/verify-code", variables);
    },
    onSuccess: (data: any) => {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.removeItem("verify_email");
      toast({
        title: "Account Activated",
        description: "Your email has been verified successfully.",
      });
      if (data.user.role === "ORGANIZER" || data.user.role === "ADMIN") {
        navigate("/organizer-dashboard");
      } else {
        navigate("/dashboard");
      }
    },
    onError: (err: any) => {
      setError(err.message || "Invalid or expired verification code.");
    },
  });

  // React Query mutation for resending code
  const resendMutation = useMutation({
    mutationFn: (variables: { email: string }) => {
      return api.post("/auth/resend-verification", variables);
    },
    onSuccess: () => {
      toast({
        title: "Verification Email Sent",
        description: "We have resent the code to your inbox.",
      });
    },
    onError: (err: any) => {
      setError(err.message || "Failed to resend code.");
    },
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }
    setError("");
    verifyMutation.mutate({ email, code });
  };

  const handleResend = () => {
    setError("");
    resendMutation.mutate({ email });
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-wadu-teal/10 border-2 border-wadu-teal flex items-center justify-center mx-auto mb-8 animate-pulse">
          <Mail className="text-wadu-teal" size={36} />
        </div>

        <p className="text-wadu-purple font-extrabold text-sm uppercase tracking-widest mb-3">
          Almost There
        </p>
        <h1 className="text-3xl font-extrabold text-wadu-navy dark:text-white mb-4">
          Verify your email
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-semibold mb-8 max-w-sm mx-auto text-sm leading-relaxed">
          We sent a 6-digit confirmation code to {email || "your email"}. Enter it to activate your account.
        </p>

        <form onSubmit={handleVerify} className="space-y-4 mb-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            autoComplete="off"
            className="w-full text-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal font-extrabold text-2xl tracking-widest"
          />

          <button
            type="submit"
            disabled={verifyMutation.isPending}
            className="w-full bg-wadu-navy text-white hover:bg-wadu-teal hover:text-wadu-navy py-3.5 rounded-xl font-bold transition duration-200 text-sm shadow-sm"
          >
            {verifyMutation.isPending ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        <div className="space-y-4">
          <button
            onClick={handleResend}
            disabled={resendMutation.isPending}
            className="w-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-wadu-teal py-3.5 rounded-xl font-bold transition duration-200 text-sm shadow-sm"
          >
            {resendMutation.isPending ? "Resending..." : "Resend Email"}
          </button>
          
          <Link
            to="/sign-in"
            className="inline-block text-sm text-slate-500 hover:text-wadu-teal font-bold transition duration-200 mt-2"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </Layout>
  );
}
