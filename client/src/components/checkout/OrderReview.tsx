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
        <h2 className="text-2xl font-bold text-white mb-2">
          Step 1 of 3: Ticket Selection
        </h2>
        <p className="text-gray-400 text-sm">
          Select the tickets you want to purchase.
        </p>
      </div>

      {/* Error Alert (if no tickets selected) - placeholder for validation */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
        <span className="text-red-400 text-lg">⚠️</span>
        <div>
          <p className="text-red-400 font-semibold text-sm">
            Please select at least one ticket to continue.
          </p>
        </div>
      </div>

      {/* Ticket Options */}
      <div className="space-y-4">
        {ticketOptions.map((ticket) => (
          <div
            key={ticket.name}
            className="group relative bg-white/5 border border-slate-800 rounded-xl p-5 hover:border-purple-500/50 hover:bg-white/10 transition duration-300"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h4 className="text-white font-semibold text-lg group-hover:text-purple-300 transition">
                  {ticket.name}
                </h4>
                <p className="text-gray-400 text-sm mt-1">{ticket.desc}</p>
              </div>
              <div className="flex items-center gap-4 justify-between sm:justify-end">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-bold text-lg">
                  KES {ticket.price.toLocaleString()}
                </span>
                <input
                  type="number"
                  min="0"
                  defaultValue="0"
                  className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 font-semibold text-center"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold tracking-wide transition shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30"
      >
        Continue to Your Details
      </button>
    </div>
  );
}
