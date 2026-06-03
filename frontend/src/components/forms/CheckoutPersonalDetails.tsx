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
        <h2 className="text-2xl font-bold text-wadu-navy dark:text-white mb-2">
          Step 2 of 3: Attendee Details
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Provide your information to receive tickets.
        </p>
      </div>

      <div className="bg-wadu-teal/5 border border-wadu-teal/20 rounded-xl p-4 flex items-start gap-3">
        <span className="text-wadu-teal text-lg leading-none">ℹ️</span>
        <div>
          <p className="text-wadu-teal font-bold text-sm">
            Sign in to access saved details and complete your purchase faster.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.label}>
            <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              {field.label}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-4 text-slate-800 dark:text-white placeholder-slate-450 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal font-medium transition duration-200"
            />
          </div>
        ))}
      </div>

      {/* Ticket Delivery */}
      <div>
        <h4 className="text-wadu-navy dark:text-white font-bold text-sm mb-3">
          Ticket Delivery Method
        </h4>
        <div className="flex gap-3">
          {(["Email", "WhatsApp", "Both"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setDeliveryMethod(option)}
              className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition duration-200 ${
                deliveryMethod === option
                  ? "bg-wadu-purple text-white shadow-sm border border-wadu-purple"
                  : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-wadu-teal hover:border-wadu-teal border border-slate-200 dark:border-slate-800"
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
            className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-wadu-purple focus:ring-wadu-purple focus:ring-offset-slate-950 mt-0.5"
          />
          <span className="text-slate-500 dark:text-slate-400 group-hover:text-wadu-teal transition text-sm font-medium">
            Subscribe to our mailing list for updates and exclusive offers.
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-wadu-purple focus:ring-wadu-purple focus:ring-offset-slate-950 mt-0.5"
            defaultChecked
          />
          <span className="text-slate-500 dark:text-slate-400 group-hover:text-wadu-teal transition text-sm font-medium">
            I agree to the terms and conditions and privacy policy.
          </span>
        </label>
      </div>

      <div className="pt-2">
        <button
          onClick={onContinue}
          className="w-full bg-wadu-navy border border-wadu-navy/15 hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal text-white py-4 rounded-xl font-bold tracking-wide transition duration-200 shadow-sm"
        >
          Continue to Payment
        </button>
        <p className="text-slate-450 dark:text-slate-500 text-xs text-center mt-4 font-semibold">
          You are checking out as a guest. You can create an account later.
        </p>
      </div>
    </div>
  );
}
