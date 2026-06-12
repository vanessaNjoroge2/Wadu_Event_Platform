import { Layout } from "@/components/Layout";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { EventCard } from "@/components/events/EventCard";

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
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
    "Music",
    "Tech",
    "Culture",
    "Food & Drink",
    "Arts & Culture",
  ];

  // Filter events based on search query and category
  const filteredEvents = events.filter((event) => {
    const matchesQuery =
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.location.toLowerCase().includes(query.toLowerCase());
    
    const matchesCategory = selectedCategory
      ? event.category.toLowerCase() === selectedCategory.toLowerCase()
      : true;

    return matchesQuery && matchesCategory;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search header */}
        <div className="mb-10">
          <p className="text-wadu-purple font-extrabold text-sm uppercase tracking-widest mb-2">
            Search Results
          </p>
          <h1 className="text-3xl font-extrabold text-wadu-navy dark:text-white">
            Results for "{query}"
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-semibold mt-1">
            {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"} found
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category ? null : category
                )
              }
              className={`px-5 py-2 rounded-full font-bold text-sm transition duration-200 ${
                selectedCategory === category
                  ? "bg-wadu-purple text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-wadu-teal dark:hover:border-wadu-teal hover:text-wadu-teal"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Events grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl mx-auto">
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-lg mb-4">
              No events found matching your search.
            </p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchParams({});
              }}
              className="bg-wadu-navy border border-wadu-navy/10 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal transition duration-200"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
