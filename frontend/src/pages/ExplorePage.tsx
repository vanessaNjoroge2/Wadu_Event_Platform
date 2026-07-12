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
      <section className="bg-wadu-yellow border-b-8 border-wadu-black py-10 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase text-wadu-black mb-6 md:mb-8">Find Events</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-wadu-black" size={20} />
              <input
                type="text"
                placeholder="SEARCH EVENTS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-4 border-wadu-black rounded-none py-3.5 pl-11 pr-4 text-wadu-black font-black uppercase placeholder-wadu-black/50 focus:outline-none shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] transition duration-200 text-sm"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-wadu-black" size={20} />
              <input
                type="text"
                placeholder="LOCATION..."
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full bg-white border-4 border-wadu-black rounded-none py-3.5 pl-11 pr-4 text-wadu-black font-black uppercase placeholder-wadu-black/50 focus:outline-none shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] transition duration-200 text-sm"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-wadu-black" size={20} />
              <input
                type="text"
                placeholder="DATE"
                value={dateQuery}
                onChange={(e) => setDateQuery(e.target.value)}
                className="w-full bg-white border-4 border-wadu-black rounded-none py-3.5 pl-11 pr-4 text-wadu-black font-black uppercase placeholder-wadu-black/50 focus:outline-none shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] transition duration-200 text-sm"
              />
            </div>
          </div>

          {/* Category Filter Chips */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 md:gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-none font-black uppercase text-xs border-2 border-wadu-black transition duration-200 ${
                  selectedCategory === null
                    ? "bg-wadu-black text-wadu-yellow"
                    : "bg-white text-wadu-black hover:bg-wadu-black hover:text-wadu-yellow"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category ? null : category
                    )
                  }
                  className={`px-4 py-2 rounded-none font-black uppercase text-xs border-2 border-wadu-black transition duration-200 ${
                    selectedCategory === category
                      ? "bg-wadu-black text-wadu-yellow shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                      : "bg-white text-wadu-black shadow-[3px_3px_0px_0px_rgba(5,5,5,1)] hover:bg-wadu-black hover:text-wadu-yellow hover:shadow-none"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 md:py-20 px-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-24">
            <div className="animate-spin h-14 w-14 border-8 border-wadu-black border-t-wadu-yellow mx-auto mb-6"></div>
            <p className="text-wadu-black font-black uppercase text-xl">Loading Events...</p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b-4 border-wadu-black pb-4">
              <p className="text-wadu-black font-black uppercase text-lg md:text-2xl">
                {events.length} Event{events.length !== 1 ? 's' : ''} Found
              </p>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs font-black uppercase text-wadu-black bg-wadu-yellow border-2 border-wadu-black px-3 py-1.5 hover:bg-wadu-black hover:text-wadu-yellow transition duration-200 self-start sm:self-auto"
                >
                  ✕ Clear Filter
                </button>
              )}
            </div>

            {events.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 md:py-24 bg-wadu-yellow border-4 border-wadu-black max-w-lg mx-auto px-6 shadow-[8px_8px_0px_0px_rgba(5,5,5,1)]">
                <Search className="text-wadu-black mx-auto mb-5" size={48} />
                <h3 className="text-2xl md:text-3xl font-black uppercase text-wadu-black mb-3">No events found</h3>
                <p className="text-wadu-black/80 font-bold text-sm mb-8">
                  Try different keywords or clear your active filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery("");
                    setLocationQuery("");
                    setDateQuery("");
                  }}
                  className="bg-wadu-black border-2 border-wadu-black text-wadu-yellow px-8 py-4 font-black uppercase hover:bg-white hover:text-wadu-black transition duration-200 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </Layout>
  );
}
