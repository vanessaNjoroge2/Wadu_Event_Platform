interface OrderReviewProps {
  selectedTickets: Record<string, number>;
  prices: Record<string, number>;
  subtotal: number;
  onContinue: () => void;
}

export function OrderReview({ selectedTickets, prices, subtotal, onContinue }: OrderReviewProps) {
  // Convert selectedTickets to an array for rendering
  const items = Object.keys(selectedTickets)
    .map((key) => {
      const qty = selectedTickets[key];
      const price = prices[key] || 0;
      const readableName = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return {
        name: readableName,
        price,
        quantity: qty,
        total: qty * price,
      };
    })
    .filter((item) => item.quantity > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-wadu-navy dark:text-white mb-2">
          Step 1 of 3: Ticket Review
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Review the tickets you selected.
        </p>
      </div>

      {/* Ticket Options */}
      <div className="space-y-4">
        {items.map((ticket) => (
          <div
            key={ticket.name}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-wadu-teal dark:hover:border-wadu-teal transition duration-300 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h4 className="text-wadu-navy dark:text-white font-bold text-lg group-hover:text-wadu-teal transition duration-200">
                  {ticket.name}
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Quantity: <span className="font-bold text-wadu-navy dark:text-white">{ticket.quantity}</span>
                </p>
              </div>
              <div className="flex items-center gap-4 justify-between sm:justify-end">
                <span className="text-slate-400 text-sm font-semibold">
                  {ticket.quantity} x KES {ticket.price.toLocaleString()}
                </span>
                <span className="text-wadu-purple font-extrabold text-base">
                  KES {ticket.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-slate-500 font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            No tickets selected. Please go back and select tickets.
          </div>
        )}
      </div>

      <button
        onClick={onContinue}
        disabled={items.length === 0}
        className="w-full bg-wadu-navy border border-wadu-navy/15 hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal text-white py-4 rounded-xl font-bold tracking-wide transition duration-200 shadow-sm text-center disabled:opacity-50"
      >
        Continue to Your Details
      </button>
    </div>
  );
}
