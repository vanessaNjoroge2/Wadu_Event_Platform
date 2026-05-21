import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { OrderReview } from "@/components/checkout/OrderReview";
import { PersonalDetails } from "@/components/checkout/PersonalDetails";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  const mockEvent = {
    title: "AfroNation Nairobi 2025",
    date: "Aug 15-17, 2025",
    location: "Uhuru Gardens, Nairobi",
    image: "bg-gradient-to-br from-purple-600 to-pink-600",
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition"
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
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition duration-300 ${
                  step >= 1
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20"
                    : "bg-slate-800 text-gray-500"
                }`}
              >
                {step > 1 ? <Check size={20} /> : "1"}
              </div>
              <span
                className={`text-sm font-semibold ${
                  step >= 1 ? "text-white" : "text-gray-500"
                }`}
              >
                Tickets
              </span>
            </div>

            {/* Line 1 */}
            <div
              className={`flex-1 h-1 mx-4 mb-8 transition duration-300 ${
                step >= 2
                  ? "bg-gradient-to-r from-purple-600 to-pink-600"
                  : "bg-slate-800"
              }`}
            />

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition duration-300 ${
                  step >= 2
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20"
                    : "bg-slate-800 text-gray-500"
                }`}
              >
                {step > 2 ? <Check size={20} /> : "2"}
              </div>
              <span
                className={`text-sm font-semibold ${
                  step >= 2 ? "text-white" : "text-gray-500"
                }`}
              >
                Details
              </span>
            </div>

            {/* Line 2 */}
            <div
              className={`flex-1 h-1 mx-4 mb-8 transition duration-300 ${
                step >= 3
                  ? "bg-gradient-to-r from-purple-600 to-pink-600"
                  : "bg-slate-800"
              }`}
            />

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition duration-300 ${
                  step >= 3
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20"
                    : "bg-slate-800 text-gray-500"
                }`}
              >
                3
              </div>
              <span
                className={`text-sm font-semibold ${
                  step >= 3 ? "text-white" : "text-gray-500"
                }`}
              >
                Payment
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {step === 1 && <OrderReview onContinue={handleSelectTickets} />}
            {step === 2 && <PersonalDetails onContinue={handleFillAttendees} />}
            {step === 3 && <PaymentStep onPlaceOrder={handlePlaceOrder} />}
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit sticky top-24 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6 border-b border-slate-800 pb-6">
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Event</p>
                <h4 className="text-white font-semibold text-base">{mockEvent.title}</h4>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Date & Time</p>
                <p className="text-white text-sm font-medium">{mockEvent.date}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Location</p>
                <p className="text-white text-sm font-medium">{mockEvent.location}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-gray-400 font-medium">
                <span>2x General Admission</span>
                <span className="text-white font-semibold">KES 5,000</span>
              </div>
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Service Fee</span>
                <span className="text-white font-semibold">KES 500</span>
              </div>
              <div className="flex justify-between text-white font-bold border-t border-slate-800 pt-3 text-base">
                <span>Total</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  KES 5,500
                </span>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3.5 text-center">
              <p className="text-blue-300 text-xs font-semibold">
                ✓ 100% Buyer Guarantee. Your tickets are secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
