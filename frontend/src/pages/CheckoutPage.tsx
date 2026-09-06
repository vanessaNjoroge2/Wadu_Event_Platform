import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { OrderReview } from "@/components/forms/CheckoutOrderReview";
import { PersonalDetails } from "@/components/forms/CheckoutPersonalDetails";
import { PaymentStep } from "@/components/forms/CheckoutPaymentStep";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const stateData = location.state || {};
  const eventData = stateData.event || {
    title: "Event Details",
    date: "Date & Time",
    location: "Location Info",
  };

  const selectedTickets = stateData.selectedTickets || {};
  const prices = stateData.prices || {};
  const subtotal = stateData.subtotal || 0;
  const serviceFee = stateData.serviceFee || 0;
  const total = stateData.total || 0;

  // Personal details state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"EMAIL" | "WHATSAPP" | "BOTH">("BOTH");

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "MPESA" | "PAYPAL" | "BANK">("CARD");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [billingCountry, setBillingCountry] = useState("");
  const [mpesaPhone, setMpesaPhone] = useState("");

  // Polling state
  const [polling, setPolling] = useState(false);
  const [pollMessage, setPollMessage] = useState("");

  const handleSelectTickets = () => {
    setStep(2);
    toast({
      title: "Tickets Selected",
      description: "Please provide your personal details to proceed.",
    });
  };

  const handleFillAttendees = () => {
    if (!mpesaPhone.trim() && phone.trim()) {
      setMpesaPhone(phone.trim());
    }
    setStep(3);
    toast({
      title: "Details Verified",
      description: "Please select a payment method and place your order.",
    });
  };

  const startMpesaPolling = (orderId: string) => {
    setPolling(true);
    setPollMessage("Checking payment status on your device...");

    let attempts = 0;
    const maxAttempts = 90; // 180 seconds (3 minutes)
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/payments/mpesa/status/${orderId}`);
        if (!res.ok) {
          throw new Error("Failed to query transaction status");
        }
        const json = await res.json();
        const payload = json.data || json;
        const status = payload.status;
        const order = payload.order;

        if (status === "SUCCESS") {
          clearInterval(interval);
          setPolling(false);
          toast({
            title: "Payment Received",
            description: "Your ticket booking is confirmed.",
          });
          navigate("/order-confirmation", { state: { order } });
        } else if (status === "FAILED") {
          clearInterval(interval);
          setPolling(false);
          toast({
            title: "Payment Failed",
            description: "The M-Pesa transaction was cancelled or failed.",
            variant: "destructive",
          });
        } else {
          if (attempts >= maxAttempts) {
            clearInterval(interval);
            setPolling(false);
            toast({
              title: "Payment Timeout",
              description: "We could not verify your payment in time. Please check your messages.",
              variant: "destructive",
            });
          }
        }
      } catch (err: any) {
        console.error("Polling error:", err);
      }
    }, 2000);
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers: any = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const orderPayload = {
        eventId: stateData.eventId,
        items: stateData.orderItems,
        firstName,
        lastName,
        email,
        phone,
        deliveryMethod,
        paymentMethod,
      };

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify(orderPayload),
      });

      if (!orderRes.ok) {
        const errJson = await orderRes.json();
        throw new Error(errJson.message || "Failed to create order");
      }

      const orderJson = await orderRes.json();
      const order = orderJson.data;

      if (paymentMethod === "MPESA") {
        const initiateRes = await fetch("/api/payments/mpesa/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            phone: mpesaPhone.trim() || phone.trim(),
            amount: order.total,
          }),
        });

        if (!initiateRes.ok) {
          const errJson = await initiateRes.json();
          throw new Error(errJson.message || "Failed to initiate M-Pesa push");
        }

        startMpesaPolling(order.id);
      } else {
        toast({
          title: "Order Placed Successfully",
          description: "Your tickets have been sent to your delivery destinations.",
        });
        navigate("/order-confirmation", { state: { order } });
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Checkout Error",
        description: err.message || "Something went wrong during checkout. Please try again.",
        variant: "destructive",
      });
    }
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
            {step === 1 && (
              <OrderReview
                selectedTickets={selectedTickets}
                prices={prices}
                subtotal={subtotal}
                onContinue={handleSelectTickets}
              />
            )}
            {step === 2 && (
              <PersonalDetails
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                deliveryMethod={deliveryMethod}
                setDeliveryMethod={setDeliveryMethod}
                onContinue={handleFillAttendees}
              />
            )}
            {step === 3 && (
              <PaymentStep
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                expiry={expiry}
                setExpiry={setExpiry}
                cvv={cvv}
                setCvv={setCvv}
                cardholderName={cardholderName}
                setCardholderName={setCardholderName}
                billingCountry={billingCountry}
                setBillingCountry={setBillingCountry}
                mpesaPhone={mpesaPhone}
                setMpesaPhone={setMpesaPhone}
                onPlaceOrder={handlePlaceOrder}
              />
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 h-fit sticky top-24 shadow-md transition-all duration-300">
            <h3 className="text-lg font-bold text-wadu-navy dark:text-white mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div>
                <p className="text-slate-455 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Event</p>
                <h4 className="text-wadu-navy dark:text-white font-bold text-base">{eventData.title}</h4>
              </div>
              <div>
                <p className="text-slate-455 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Date & Time</p>
                <p className="text-slate-700 dark:text-slate-350 text-sm font-semibold">{eventData.date}</p>
              </div>
              <div>
                <p className="text-slate-455 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Location</p>
                <p className="text-slate-700 dark:text-slate-350 text-sm font-semibold">{eventData.location}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm mb-6 font-semibold">
              {Object.keys(selectedTickets).map((ticketKey) => {
                const qty = selectedTickets[ticketKey];
                const price = prices[ticketKey] || 0;
                if (qty <= 0) return null;
                const readableName = ticketKey.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
                return (
                  <div key={ticketKey} className="flex justify-between text-slate-500 dark:text-slate-450">
                    <span>{qty}x {readableName}</span>
                    <span className="text-wadu-navy dark:text-white font-bold">KES {(qty * price).toLocaleString()}</span>
                  </div>
                );
              })}
              <div className="flex justify-between text-slate-500 dark:text-slate-455">
                <span>Service Fee</span>
                <span className="text-wadu-navy dark:text-white font-bold">KES {serviceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-wadu-navy dark:text-white font-extrabold border-t border-slate-100 dark:border-slate-800 pt-3 text-base">
                <span>Total</span>
                <span className="text-wadu-purple font-extrabold">
                  KES {total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-wadu-teal/5 border border-wadu-teal/20 rounded-xl p-4 text-center">
              <p className="text-wadu-teal text-xs font-bold">
                100% Buyer Guarantee. Your tickets are secure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* M-Pesa Polling Modal */}
      {polling && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wadu-purple mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-wadu-navy dark:text-white mb-2">
              Processing M-Pesa Payment
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-4">
              {pollMessage}
            </p>
            <p className="text-xs text-slate-400">
              Please enter your M-Pesa PIN on your phone. Do not close this window.
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
}
