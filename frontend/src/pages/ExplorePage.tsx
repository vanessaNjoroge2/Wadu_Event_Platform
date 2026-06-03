import { Layout } from "@/components/Layout";
import { Search, MapPin, Calendar } from "lucide-react";
import { useState } from "react";
import { EventCard } from "@/components/events/EventCard";

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const events = [
    {
      id: 1,
      title: "AfroNation Nairobi 2025",
      category: "Music",
      location: "Nairobi, Kenya",
      date: "Fri, Dec 1, 2025 • 5:00 PM",
      price: "From KES 3,500",
      status: "ON SALE",
    },
    {
      id: 2,
      title: "East Africa Tech Summit",
      category: "Tech",
      location: "Kigali, Rwanda",
      date: "Mon, Oct 20, 2025 • 9:00 AM",
      price: "From KES 2,000",
      status: "ON SALE",
    },
    {
      id: 3,
      title: "Lamu Cultural Festival",
      category: "Culture",
      location: "Lamu, Kenya",
      date: "Sat, Nov 15, 2025 • 10:00 AM",
      price: "From KES 1,200",
      status: "ON SALE",
    },
    {
      id: 4,
      title: "Nairobi Food Market",
      category: "Food & Drink",
      location: "Nairobi, Kenya",
      date: "Sun, Nov 26, 2025 • 12:00 PM",
      price: "From KES 1,500",
      status: "LAST 47 TICKETS",
    },
    {
      id: 5,
      title: "Nairobi Tech Week",
      category: "Tech",
      location: "Nairobi, Kenya",
      date: "Oct 15-18, 2024",
      price: "From KES 500",
      status: "ON SALE",
    },
    {
      id: 6,
      title: "Safari Art Biennale",
      category: "Arts & Culture",
      location: "Mombasa, Kenya",
      date: "Fri, Dec 1, 2024 • 10:00 AM",
      price: "From KES 1,800",
      status: "ON SALE",
    },
  ];

  const categories = [
    "Concerts",
    "Tech",
    "Culture",
    "Food & Drink",
    "Sports",
    "Festivals",
  ];

  const filteredEvents = selectedCategory
    ? events.filter(
        (event) =>
          event.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    : events;

  return (
    <Layout>
      {/* Search & Filter Section */}
      <section className="bg-white dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 py-12 px-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-wadu-navy dark:text-white mb-8">Find Events</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-wadu-teal" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-3.5 pl-12 pr-4 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-medium"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-wadu-teal" size={20} />
              <input
                type="text"
                placeholder="Nairobi, KE"
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-3.5 pl-12 pr-4 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-medium"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-wadu-teal" size={20} />
              <input
                type="text"
                placeholder="Date"
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-3.5 pl-12 pr-4 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-medium"
              />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2.5">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category ? null : category
                  )
                }
                className={`px-5 py-2.5 rounded-full font-bold text-sm transition duration-200 ${
                  selectedCategory === category
                    ? "bg-wadu-purple text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-wadu-teal dark:hover:border-wadu-teal hover:text-wadu-teal"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <p className="text-slate-500 dark:text-slate-400 mb-8 font-semibold">
          Showing {filteredEvents.length} events
        </p>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-lg">No events found in this category.</p>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mt-4 bg-wadu-navy border border-wadu-navy/10 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal transition duration-200"
            >
              Clear Filter
            </button>
          </div>
        )}
      </section>
    </Layout>
  );
}
