import { Layout } from "@/components/Layout";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function OrderConfirmationPage() {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        {/* Success icon - large circle */}
        <div className="w-24 h-24 rounded-full bg-wadu-teal/10 border-2 border-wadu-teal flex items-center justify-center mx-auto mb-8 animate-bounce">
          <CheckCircle2 className="text-wadu-teal" size={48} />
        </div>

        {/* Heading */}
        <p className="text-wadu-purple font-extrabold text-sm uppercase tracking-widest mb-3">
          Booking Confirmed
        </p>
        <h1 className="text-4xl font-extrabold text-wadu-navy dark:text-white mb-4">
          You are going!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-semibold mb-10 max-w-md mx-auto">
          Your tickets have been sent to your email and WhatsApp.
          Check your inbox for your booking confirmation.
        </p>

        {/* Order summary card */}
        {order && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-left mb-8 shadow-sm space-y-4 animate-fade-in">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Order Reference</span>
              <span className="text-wadu-navy dark:text-white font-bold text-sm">#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Payment Status</span>
              <span className="text-wadu-navy dark:text-white font-bold text-sm">{order.paymentStatus}</span>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Total Paid</span>
              <span className="text-wadu-purple font-extrabold text-lg">KES {order.total?.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="bg-wadu-purple text-white hover:bg-wadu-teal hover:text-wadu-navy px-6 py-3.5 rounded-xl font-bold transition duration-200 shadow-sm text-center"
          >
            View My Tickets
          </Link>
          <Link
            to="/explore"
            className="bg-wadu-navy text-white border border-slate-200 dark:border-slate-800 hover:bg-wadu-teal hover:text-wadu-navy px-6 py-3.5 rounded-xl font-bold transition duration-200 text-center"
          >
            Explore More Events
          </Link>
        </div>
      </div>
    </Layout>
  );
}
