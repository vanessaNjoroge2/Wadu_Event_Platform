import { useState } from "react";
import { Lock } from "lucide-react";

interface PaymentStepProps {
  onPlaceOrder: () => void;
}

export function PaymentStep({ onPlaceOrder }: PaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState<"Card" | "M-Pesa" | "PayPal" | "Bank">("Card");

  const paymentMethods = [
    { id: "Card", label: "Card" },
    { id: "M-Pesa", label: "M-Pesa" },
    { id: "PayPal", label: "PayPal" },
    { id: "Bank", label: "Bank" },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Step 3 of 3: Payment
        </h2>
        <p className="text-gray-400 text-sm">
          Select a payment method and finalize your booking.
        </p>
      </div>

      <div>
        <h4 className="text-white font-semibold text-sm mb-3">
          Select Payment Method
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setPaymentMethod(method.id)}
              className={`py-3.5 rounded-xl font-bold text-sm transition duration-300 ${
                paymentMethod === method.id
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10"
                  : "bg-slate-900 text-gray-400 hover:text-white border border-slate-800 hover:bg-slate-850"
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>
      </div>

      {paymentMethod === "Card" && (
        <div className="space-y-4 bg-slate-900/40 border border-slate-800 p-5 rounded-2xl animate-fade-in">
          <div>
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Card Number
            </label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 font-medium transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="MM / YY"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 font-medium transition"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                CVV
              </label>
              <input
                type="password"
                placeholder="•••"
                maxLength={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 font-medium transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="Name on card"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 font-medium transition"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Billing Country
            </label>
            <input
              type="text"
              placeholder="e.g. Kenya"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 font-medium transition"
            />
          </div>
        </div>
      )}

      {paymentMethod === "M-Pesa" && (
        <div className="space-y-4 bg-slate-900/40 border border-slate-800 p-5 rounded-2xl animate-fade-in">
          <div>
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
              M-Pesa Mobile Number
            </label>
            <input
              type="tel"
              placeholder="e.g. +254 700 000000"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 font-medium transition"
            />
            <p className="text-gray-500 text-xs mt-2">
              You will receive an STK Push prompt on your phone to enter your M-Pesa PIN.
            </p>
          </div>
        </div>
      )}

      {paymentMethod === "PayPal" && (
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl text-center">
          <p className="text-gray-400 text-sm">
            Clicking the button below will securely open the PayPal login window to complete your purchase.
          </p>
        </div>
      )}

      {paymentMethod === "Bank" && (
        <div className="space-y-4 bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
          <div>
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Select Your Bank
            </label>
            <select className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-purple-500 font-medium transition">
              <option value="kcb">KCB Bank</option>
              <option value="equity">Equity Bank</option>
              <option value="coop">Co-operative Bank</option>
              <option value="absa">Absa Bank</option>
            </select>
          </div>
        </div>
      )}

      <button
        onClick={onPlaceOrder}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold tracking-wide transition shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 flex items-center justify-center gap-2"
      >
        <Lock size={18} />
        Place Order
      </button>
    </div>
  );
}
