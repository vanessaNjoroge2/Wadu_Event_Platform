import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export default function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    if (!order || order.paymentStatus !== "PAID") {
      const timer = setTimeout(() => {
        navigate("/explore");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [order, navigate]);

  if (!order || order.paymentStatus !== "PAID") {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="text-amber-500 animate-pulse" size={36} />
          </div>
          <h1 className="text-3xl font-extrabold text-wadu-navy dark:text-white">
            Access Pending or Denied
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-semibold max-w-md mx-auto">
            You cannot view this page without a verified successful order. Redirecting you to explore events in 5 seconds...
          </p>
          <div className="pt-4">
            <Link
              to="/explore"
              className="bg-wadu-purple text-white hover:bg-wadu-teal hover:text-wadu-navy px-6 py-3.5 rounded-xl font-bold transition duration-200 shadow-sm"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-left mb-8 shadow-sm space-y-6 animate-fade-in">
            {/* Event Header info */}
            <div>
              <h2 className="text-wadu-navy dark:text-white font-extrabold text-lg mb-1">
                {order.event?.title}
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                {order.event && new Date(order.event.startDate).toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 font-bold">
                {order.event?.location}
              </p>
            </div>

            {/* Dashed Separator */}
            <div className="border-t-2 border-dashed border-slate-100 dark:border-slate-800" />

            {/* Receipt Items Breakdown */}
            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Receipt Details</p>
              {order.items && order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-500 dark:text-slate-400">
                    {item.quantity}x {item.ticketType?.name || "Ticket"}
                  </span>
                  <span className="text-wadu-navy dark:text-white">
                    KES {(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-semibold pt-1">
                <span className="text-slate-500 dark:text-slate-400">Service Fee (10%)</span>
                <span className="text-wadu-navy dark:text-white">KES {order.serviceFee?.toLocaleString()}</span>
              </div>
            </div>

            {/* Dashed Separator */}
            <div className="border-t-2 border-dashed border-slate-100 dark:border-slate-800" />

            {/* Summary details & QR Code */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex justify-between md:flex-col md:justify-start">
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Ticket Number</span>
                  <span className="text-wadu-purple font-extrabold text-base tracking-wider">#TKT-{order.id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex justify-between md:flex-col md:justify-start">
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Payment Status</span>
                  <span className="text-wadu-navy dark:text-white font-bold text-sm">{order.paymentStatus}</span>
                </div>
                <div className="flex justify-between md:flex-col md:justify-start border-t border-slate-100 dark:border-slate-800 pt-2">
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Total Paid</span>
                  <span className="text-wadu-purple font-extrabold text-xl">KES {order.total?.toLocaleString()}</span>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-3 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 flex-shrink-0 mx-auto md:mx-0">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=WDU-TKT-${order.id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`}
                  alt="Order QR Code"
                  className="w-32 h-32 border border-slate-200 dark:border-slate-800 rounded-lg p-1 bg-white"
                />
                <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold mt-2">Scan at the entrance</span>
              </div>
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
