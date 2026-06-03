import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { OrderReview } from "@/components/forms/CheckoutOrderReview";
import { PersonalDetails } from "@/components/forms/CheckoutPersonalDetails";
import { PaymentStep } from "@/components/forms/CheckoutPaymentStep";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  const mockEvent = {
    title: "AfroNation Nairobi 2025",
    date: "Aug 15-17, 2025",
    location: "Uhuru Gardens, Nairobi",
  };

  const handleSelectTickets = () => {
    setStep(2);
    toast({
      title: "Tickets Selected",
      description: "Please provide your personal details to proceed.",
    });
  };

  const handleFillAttendees = () => {
    setStep(3);
    toast({
      title: "Details Verified",
      description: "Please select a payment method and place your order.",
    });
  };

  const handlePlaceOrder = () => {
    toast({
      title: "Order Placed Successfully 🎉",
      description: "Your tickets have been sent to your email & WhatsApp.",
    });
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-wadu-teal dark:hover:text-wadu-teal mb-8 font-bold transition duration-200"
        >
          <ArrowLeft size={18} />
          Back to Events
        </Link>

        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg mb-2 transition duration-300 ${
                  step >= 1
                    ? "bg-wadu-purple text-white shadow-sm"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-450 dark:text-gray-500"
                }`}
              >
                {step > 1 ? <Check size={20} /> : "1"}
              </div>
              <span
                className={`text-sm font-bold ${
                  step >= 1 ? "text-wadu-navy dark:text-white" : "text-slate-400 dark:text-gray-500"
                }`}
              >
                Tickets
              </span>
            </div>

            {/* Line 1 */}
            <div
              className={`flex-1 h-1 mx-4 mb-8 transition duration-300 ${
                step >= 2
                  ? "bg-wadu-purple"
                  : "bg-slate-200 dark:bg-slate-800"
              }`}
            />

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg mb-2 transition duration-300 ${
                  step >= 2
                    ? "bg-wadu-purple text-white shadow-sm"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-450 dark:text-gray-500"
                }`}
              >
                {step > 2 ? <Check size={20} /> : "2"}
              </div>
              <span
                className={`text-sm font-bold ${
                  step >= 2 ? "text-wadu-navy dark:text-white" : "text-slate-400 dark:text-gray-500"
                }`}
              >
                Details
              </span>
            </div>

            {/* Line 2 */}
            <div
              className={`flex-1 h-1 mx-4 mb-8 transition duration-300 ${
                step >= 3
                  ? "bg-wadu-purple"
                  : "bg-slate-200 dark:bg-slate-800"
              }`}
            />

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg mb-2 transition duration-300 ${
                  step >= 3
                    ? "bg-wadu-purple text-white shadow-sm"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-450 dark:text-gray-500"
                }`}
              >
                {step > 2 ? <Check size={20} /> : "3"}
              </div>
              <span
                className={`text-sm font-bold ${
                  step >= 3 ? "text-wadu-navy dark:text-white" : "text-slate-400 dark:text-gray-500"
                }`}
              >
                Payment
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            {step === 1 && <OrderReview onContinue={handleSelectTickets} />}
            {step === 2 && <PersonalDetails onContinue={handleFillAttendees} />}
            {step === 3 && <PaymentStep onPlaceOrder={handlePlaceOrder} />}
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 h-fit sticky top-24 shadow-md transition-all duration-300">
            <h3 className="text-lg font-bold text-wadu-navy dark:text-white mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div>
                <p className="text-slate-450 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Event</p>
                <h4 className="text-wadu-navy dark:text-white font-bold text-base">{mockEvent.title}</h4>
              </div>
              <div>
                <p className="text-slate-450 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Date & Time</p>
                <p className="text-slate-700 dark:text-slate-350 text-sm font-semibold">{mockEvent.date}</p>
              </div>
              <div>
                <p className="text-slate-450 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Location</p>
                <p className="text-slate-700 dark:text-slate-350 text-sm font-semibold">{mockEvent.location}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm mb-6 font-semibold">
              <div className="flex justify-between text-slate-500 dark:text-slate-450">
                <span>2x General Admission</span>
                <span className="text-wadu-navy dark:text-white font-bold">KES 5,000</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-450">
                <span>Service Fee</span>
                <span className="text-wadu-navy dark:text-white font-bold">KES 500</span>
              </div>
              <div className="flex justify-between text-wadu-navy dark:text-white font-extrabold border-t border-slate-100 dark:border-slate-800 pt-3 text-base">
                <span>Total</span>
                <span className="text-wadu-purple font-extrabold">
                  KES 5,500
                </span>
              </div>
            </div>

            <div className="bg-wadu-teal/5 border border-wadu-teal/20 rounded-xl p-4 text-center">
              <p className="text-wadu-teal text-xs font-bold">
                ✓ 100% Buyer Guarantee. Your tickets are secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
