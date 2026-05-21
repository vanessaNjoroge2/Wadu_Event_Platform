import { Layout } from "@/components/Layout";
import { Search, MapPin, Calendar, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

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
      gradient: "from-purple-600 to-pink-600",
      status: "ON SALE",
    },
    {
      id: 2,
      title: "East Africa Tech Summit",
      category: "Tech",
      location: "Kigali, Rwanda",
      date: "Mon, Oct 20, 2025 • 9:00 AM",
      price: "From KES 2,000",
      gradient: "from-orange-500 to-red-500",
      status: "ON SALE",
    },
    {
      id: 3,
      title: "Lamu Cultural Festival",
      category: "Culture",
      location: "Lamu, Kenya",
      date: "Sat, Nov 15, 2025 • 10:00 AM",
      price: "From KES 1,200",
      gradient: "from-teal-500 to-green-500",
      status: "ON SALE",
    },
    {
      id: 4,
      title: "Nairobi Food Market",
      category: "Food & Drink",
      location: "Nairobi, Kenya",
      date: "Sun, Nov 26, 2025 • 12:00 PM",
      price: "From KES 1,500",
      gradient: "from-red-500 to-pink-600",
      status: "LAST 47 TICKETS",
    },
    {
      id: 5,
      title: "Nairobi Tech Week",
      category: "Tech",
      location: "Nairobi, Kenya",
      date: "Oct 15-18, 2024",
      price: "From KES 500",
      gradient: "from-blue-600 to-purple-600",
      status: "ON SALE",
    },
    {
      id: 6,
      title: "Safari Art Biennale",
      category: "Arts & Culture",
      location: "Mombasa, Kenya",
      date: "Fri, Dec 1, 2024 • 10:00 AM",
      price: "From KES 1,800",
      gradient: "from-yellow-600 to-orange-500",
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

  return (
    <Layout>
      {/* Search & Filter Section */}
      <section className="bg-slate-900/50 border-b border-slate-800 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Find Events</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Nairobi, KE"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Date"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category ? null : category
                  )
                }
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <p className="text-gray-400 mb-8">Showing 1,240 events</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/event/${event.id}`}
              className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-purple-500 transition hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className={`h-48 bg-gradient-to-br ${event.gradient}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">
                    {event.category}
                  </span>
                  <span className="text-xs font-semibold text-orange-300 bg-orange-500/20 px-3 py-1 rounded-full">
                    {event.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-300 transition line-clamp-2">
                  {event.title}
                </h3>
                <div className="space-y-2 text-sm text-gray-400 mb-4">
                  <p className="flex items-center gap-2">
                    <MapPin size={16} />
                    {event.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar size={16} />
                    {event.date}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <p className="font-bold text-white">{event.price}</p>
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition text-sm flex items-center gap-2">
                    Book <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
