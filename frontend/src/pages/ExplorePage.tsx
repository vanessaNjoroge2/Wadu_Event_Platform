import { Layout } from "@/components/Layout";
import { Search, MapPin, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { EventCard } from "@/components/events/EventCard";

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setCategories(json.data.map((c: any) => c.name));
        }
      })
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.append("category", selectedCategory);
    if (locationQuery) params.append("city", locationQuery);
    if (searchQuery) params.append("search", searchQuery);

    fetch(`/api/events?${params.toString()}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load events");
        }
        return res.json();
      })
      .then((json) => {
        if (json.data && json.data.events) {
          setEvents(json.data.events);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading events:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [selectedCategory, locationQuery, searchQuery]);

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-3.5 pl-12 pr-4 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-medium"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-wadu-teal" size={20} />
              <input
                type="text"
                placeholder="Location (e.g. Nairobi)"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-3.5 pl-12 pr-4 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-medium"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-wadu-teal" size={20} />
              <input
                type="text"
                placeholder="Date"
                value={dateQuery}
                onChange={(e) => setDateQuery(e.target.value)}
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
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-665 dark:text-slate-300 hover:border-wadu-teal dark:hover:border-wadu-teal hover:text-wadu-teal"
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
        {loading ? (
          <div className="text-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wadu-purple mx-auto mb-4"></div>
            <p className="text-slate-500 font-bold">Loading events...</p>
          </div>
        ) : (
          <>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-semibold">
              Showing {events.length} events
            </p>

            {events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl mx-auto px-4 shadow-sm">
                <Search className="text-slate-400 mx-auto mb-4" size={48} />
                <h3 className="text-lg font-bold text-wadu-navy dark:text-white mb-2">No events found for your search.</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-6">
                  Try searching with different keywords or clearing your active filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery("");
                    setLocationQuery("");
                    setDateQuery("");
                  }}
                  className="bg-wadu-navy border border-wadu-navy/10 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal transition duration-200"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </Layout>
  );
}
