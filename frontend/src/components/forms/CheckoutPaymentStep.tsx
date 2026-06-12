import { useState } from "react";
import { Lock } from "lucide-react";

interface PaymentStepProps {
  paymentMethod: "CARD" | "MPESA" | "PAYPAL" | "BANK";
  setPaymentMethod: (val: "CARD" | "MPESA" | "PAYPAL" | "BANK") => void;
  cardNumber: string;
  setCardNumber: (val: string) => void;
  expiry: string;
  setExpiry: (val: string) => void;
  cvv: string;
  setCvv: (val: string) => void;
  cardholderName: string;
  setCardholderName: (val: string) => void;
  billingCountry: string;
  setBillingCountry: (val: string) => void;
  mpesaPhone: string;
  setMpesaPhone: (val: string) => void;
  onPlaceOrder: () => void;
}

export function PaymentStep({
  paymentMethod,
  setPaymentMethod,
  cardNumber,
  setCardNumber,
  expiry,
  setExpiry,
  cvv,
  setCvv,
  cardholderName,
  setCardholderName,
  billingCountry,
  setBillingCountry,
  mpesaPhone,
  setMpesaPhone,
  onPlaceOrder,
}: PaymentStepProps) {
  const [error, setError] = useState("");

  const handlePlaceOrder = () => {
    setError("");
    if (paymentMethod === "CARD") {
      if (!cardNumber.trim() || !expiry.trim() || !cvv.trim() || !cardholderName.trim() || !billingCountry.trim()) {
        setError("Please fill in all credit card details.");
        return;
      }
    } else if (paymentMethod === "MPESA") {
      if (!mpesaPhone.trim()) {
        setError("Please enter your M-Pesa mobile number.");
        return;
      }
    }
    onPlaceOrder();
  };

  const paymentMethods = [
    { id: "CARD", label: "Card" },
    { id: "MPESA", label: "M-Pesa" },
    { id: "PAYPAL", label: "PayPal" },
    { id: "BANK", label: "Bank" },
  ] as const;

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold rounded-xl px-4 py-3">
          {error}
        </div>
      )}
      <div>
        <h2 className="text-2xl font-bold text-wadu-navy dark:text-white mb-2">
          Step 3 of 3: Payment
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Select a payment method and finalize your booking.
        </p>
      </div>

      <div>
        <h4 className="text-wadu-navy dark:text-white font-bold text-sm mb-3">
          Select Payment Method
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setPaymentMethod(method.id)}
              className={`py-3.5 rounded-xl font-bold text-sm transition duration-200 ${
                paymentMethod === method.id
                  ? "bg-wadu-purple text-white border border-wadu-purple shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-wadu-teal hover:border-wadu-teal border border-slate-200 dark:border-slate-800"
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>
      </div>

      {paymentMethod === "CARD" && (
        <div className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
          <div>
            <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              Card Number
            </label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-slate-800 dark:text-white placeholder-slate-450 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal font-medium transition duration-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="MM / YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-slate-800 dark:text-white placeholder-slate-450 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal font-medium transition duration-200"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                CVV
              </label>
              <input
                type="password"
                placeholder="---"
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-slate-800 dark:text-white placeholder-slate-450 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal font-medium transition duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="Name on card"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-slate-800 dark:text-white placeholder-slate-450 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal font-medium transition duration-200"
            />
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              Billing Country
            </label>
            <input
              type="text"
              placeholder="e.g. Kenya"
              value={billingCountry}
              onChange={(e) => setBillingCountry(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-slate-800 dark:text-white placeholder-slate-450 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal font-medium transition duration-200"
            />
          </div>
        </div>
      )}

      {paymentMethod === "MPESA" && (
        <div className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
          <div>
            <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              M-Pesa Mobile Number
            </label>
            <input
              type="tel"
              placeholder="e.g. +254 700 000000"
              value={mpesaPhone}
              onChange={(e) => setMpesaPhone(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-slate-800 dark:text-white placeholder-slate-450 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal font-medium transition duration-200"
            />
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 font-semibold">
              You will receive an STK Push prompt on your phone to enter your M-Pesa PIN.
            </p>
          </div>
        </div>
      )}

      {paymentMethod === "PAYPAL" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
            Clicking the button below will securely open the PayPal login window to complete your purchase.
          </p>
        </div>
      )}

      {paymentMethod === "BANK" && (
        <div className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
          <div>
            <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              Select Your Bank
            </label>
            <select className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-slate-800 dark:text-white focus:outline-none focus:border-wadu-teal transition duration-200 font-semibold">
              <option value="kcb">KCB Bank</option>
              <option value="equity">Equity Bank</option>
              <option value="coop">Co-operative Bank</option>
              <option value="absa">Absa Bank</option>
            </select>
          </div>
        </div>
      )}

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-wadu-navy border border-wadu-navy/15 hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal text-white py-4 rounded-xl font-bold tracking-wide transition duration-200 shadow-sm flex items-center justify-center gap-2"
      >
        <Lock size={18} />
        Place Order
      </button>
    </div>
  );
}
