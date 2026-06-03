interface TicketOption {
  name: string;
  price: number;
  desc: string;
}

interface OrderReviewProps {
  onContinue: () => void;
}

export function OrderReview({ onContinue }: OrderReviewProps) {
  const ticketOptions: TicketOption[] = [
    {
      name: "General Admission",
      price: 2500,
      desc: "Standard access to all event areas",
    },
    {
      name: "VIP Access",
      price: 7500,
      desc: "Front-row seating and backstage access",
    },
    {
      name: "VVIP Experience",
      price: 15000,
      desc: "Exclusive meet-and-greet, premium catering, and private lounge",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-wadu-navy dark:text-white mb-2">
          Step 1 of 3: Ticket Selection
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Select the tickets you want to purchase.
        </p>
      </div>

      {/* Error Alert (if no tickets selected) - placeholder for validation */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
        <span className="text-red-400 text-lg leading-none">⚠️</span>
        <div>
          <p className="text-red-650 dark:text-red-400 font-bold text-sm">
            Please select at least one ticket to continue.
          </p>
        </div>
      </div>

      {/* Ticket Options */}
      <div className="space-y-4">
        {ticketOptions.map((ticket) => (
          <div
            key={ticket.name}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-wadu-teal dark:hover:border-wadu-teal transition duration-300 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h4 className="text-wadu-navy dark:text-white font-bold text-lg group-hover:text-wadu-teal transition duration-200">
                  {ticket.name}
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{ticket.desc}</p>
              </div>
              <div className="flex items-center gap-4 justify-between sm:justify-end">
                <span className="text-wadu-purple font-extrabold text-base">
                  KES {ticket.price.toLocaleString()}
                </span>
                <input
                  type="number"
                  min="0"
                  defaultValue="0"
                  className="w-20 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-wadu-navy dark:text-white focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal font-bold text-center"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-wadu-navy border border-wadu-navy/15 hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal text-white py-4 rounded-xl font-bold tracking-wide transition duration-200 shadow-sm text-center"
      >
        Continue to Your Details
      </button>
    </div>
  );
}
