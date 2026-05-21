import { useState } from "react";

interface PersonalDetailsProps {
  onContinue: () => void;
}

export function PersonalDetails({ onContinue }: PersonalDetailsProps) {
  const [deliveryMethod, setDeliveryMethod] = useState<"Email" | "WhatsApp" | "Both">("Both");

  const fields = [
    { label: "First Name", placeholder: "First Name", type: "text" },
    { label: "Last Name", placeholder: "Last Name", type: "text" },
    { label: "Email", placeholder: "your.email@example.com", type: "email" },
    { label: "Phone", placeholder: "+254 Phone", type: "tel" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Step 2 of 3: Attendee Details
        </h2>
        <p className="text-gray-400 text-sm">
          Provide your information to receive tickets.
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
        <span className="text-blue-400 text-lg">ℹ️</span>
        <div>
          <p className="text-blue-300 font-semibold text-sm">
            Sign in to access saved details and complete your purchase faster.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.label}>
            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
              {field.label}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-medium transition duration-200"
            />
          </div>
        ))}
      </div>

      {/* Ticket Delivery */}
      <div>
        <h4 className="text-white font-semibold text-sm mb-3">
          Ticket Delivery Method
        </h4>
        <div className="flex gap-3">
          {(["Email", "WhatsApp", "Both"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setDeliveryMethod(option)}
              className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition duration-300 ${
                deliveryMethod === option
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/10"
                  : "bg-slate-900 text-gray-400 hover:text-white border border-slate-800 hover:bg-slate-850"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3 pt-2">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="w-5 h-5 rounded border-slate-800 bg-slate-900 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-950 mt-0.5"
          />
          <span className="text-gray-400 group-hover:text-gray-300 transition text-sm">
            Subscribe to our mailing list for updates and exclusive offers.
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="w-5 h-5 rounded border-slate-800 bg-slate-900 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-950 mt-0.5"
            defaultChecked
          />
          <span className="text-gray-400 group-hover:text-gray-300 transition text-sm">
            I agree to the terms and conditions and privacy policy.
          </span>
        </label>
      </div>

      <div className="pt-2">
        <button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold tracking-wide transition shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
        >
          Continue to Payment
        </button>
        <p className="text-gray-500 text-xs text-center mt-4">
          You are checking out as a guest. You can create an account later.
        </p>
      </div>
    </div>
  );
}
