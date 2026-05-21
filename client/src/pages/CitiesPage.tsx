import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const cities = [
  {
    name: "Nairobi",
    country: "Kenya",
    count: "420 events",
    gradient: "from-purple-600 to-pink-600",
    emoji: "🇰🇪",
  },
  {
    name: "Lagos",
    country: "Nigeria",
    count: "310 events",
    gradient: "from-green-500 to-teal-500",
    emoji: "🇳🇬",
  },
  {
    name: "Cape Town",
    country: "South Africa",
    count: "280 events",
    gradient: "from-orange-500 to-red-500",
    emoji: "🇿🇦",
  },
  {
    name: "Accra",
    country: "Ghana",
    count: "195 events",
    gradient: "from-yellow-500 to-orange-500",
    emoji: "🇬🇭",
  },
  {
    name: "Kigali",
    country: "Rwanda",
    count: "175 events",
    gradient: "from-blue-500 to-cyan-500",
    emoji: "🇷🇼",
  },
  {
    name: "Dar es Salaam",
    country: "Tanzania",
    count: "160 events",
    gradient: "from-teal-500 to-green-600",
    emoji: "🇹🇿",
  },
  {
    name: "Addis Ababa",
    country: "Ethiopia",
    count: "140 events",
    gradient: "from-red-500 to-pink-600",
    emoji: "🇪🇹",
  },
  {
    name: "Kampala",
    country: "Uganda",
    count: "120 events",
    gradient: "from-indigo-500 to-purple-600",
    emoji: "🇺🇬",
  },
  {
    name: "Mombasa",
    country: "Kenya",
    count: "110 events",
    gradient: "from-pink-500 to-rose-600",
    emoji: "🇰🇪",
  },
  {
    name: "Dakar",
    country: "Senegal",
    count: "95 events",
    gradient: "from-cyan-500 to-blue-600",
    emoji: "🇸🇳",
  },
  {
    name: "Johannesburg",
    country: "South Africa",
    count: "88 events",
    gradient: "from-fuchsia-500 to-purple-600",
    emoji: "🇿🇦",
  },
  {
    name: "Abidjan",
    country: "Côte d'Ivoire",
    count: "72 events",
    gradient: "from-amber-500 to-yellow-600",
    emoji: "🇨🇮",
  },
];

const regions = ["All", "East Africa", "West Africa", "Southern Africa", "North Africa"];

export default function CitiesPage() {
  return (
    <Layout>
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Browse by Location
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Events Near You
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Discover live events happening in cities across Africa and beyond.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {regions.map((r) => (
            <button
              key={r}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                r === "All"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "bg-slate-800 text-gray-300 hover:bg-slate-700"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cities.map((city, i) => (
            <Link
              key={i}
              to="/explore"
              className="group relative rounded-2xl overflow-hidden border border-slate-700 hover:border-purple-500 transition hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div
                className={`h-28 bg-gradient-to-br ${city.gradient} flex items-end p-4`}
              >
                <span className="text-3xl">{city.emoji}</span>
              </div>
              <div className="bg-slate-800/80 p-4">
                <h3 className="text-white font-bold group-hover:text-purple-300 transition">
                  {city.name}
                </h3>
                <p className="text-gray-400 text-xs flex items-center gap-1 mt-1">
                  <MapPin size={12} /> {city.country}
                </p>
                <p className="text-purple-400 text-xs font-semibold mt-1">
                  {city.count}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-12 px-4 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Don't see your city?
          </h2>
          <p className="text-gray-400 mb-6">
            We're expanding every day. Search for events in any location.
          </p>
          <Link
            to="/explore"
            className="inline-block bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-cyan-600 transition"
          >
            Search All Locations
          </Link>
        </div>
      </section>
    </Layout>
  );
}
