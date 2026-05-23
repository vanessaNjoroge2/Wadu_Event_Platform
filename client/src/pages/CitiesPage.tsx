import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const cities = [
  {
    name: "Nairobi",
    country: "Kenya",
    count: "420 events",
    emoji: "🇰🇪",
  },
  {
    name: "Lagos",
    country: "Nigeria",
    count: "310 events",
    emoji: "🇳🇬",
  },
  {
    name: "Cape Town",
    country: "South Africa",
    count: "280 events",
    emoji: "🇿🇦",
  },
  {
    name: "Accra",
    country: "Ghana",
    count: "195 events",
    emoji: "🇬🇭",
  },
  {
    name: "Kigali",
    country: "Rwanda",
    count: "175 events",
    emoji: "🇷🇼",
  },
  {
    name: "Dar es Salaam",
    country: "Tanzania",
    count: "160 events",
    emoji: "🇹🇿",
  },
  {
    name: "Addis Ababa",
    country: "Ethiopia",
    count: "140 events",
    emoji: "🇪🇹",
  },
  {
    name: "Kampala",
    country: "Uganda",
    count: "120 events",
    emoji: "🇺🇬",
  },
  {
    name: "Mombasa",
    country: "Kenya",
    count: "110 events",
    emoji: "🇰🇪",
  },
  {
    name: "Dakar",
    country: "Senegal",
    count: "95 events",
    emoji: "🇸🇳",
  },
  {
    name: "Johannesburg",
    country: "South Africa",
    count: "88 events",
    emoji: "🇿🇦",
  },
  {
    name: "Abidjan",
    country: "Côte d'Ivoire",
    count: "72 events",
    emoji: "🇨🇮",
  },
];

const regions = ["All", "East Africa", "West Africa", "Southern Africa", "North Africa"];

export default function CitiesPage() {
  return (
    <Layout>
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-wadu-teal font-extrabold text-sm uppercase tracking-widest mb-3">
            Browse by Location
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-wadu-navy dark:text-white mb-4">
            Events Near You
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
            Discover live events happening in cities across Africa and beyond.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 mb-12">
          {regions.map((r) => (
            <button
              key={r}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition duration-200 ${
                r === "All"
                  ? "bg-wadu-purple text-white shadow-sm border border-wadu-purple"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-655 dark:text-slate-300 hover:border-wadu-teal dark:hover:border-wadu-teal hover:text-wadu-teal"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cities.map((city, i) => (
            <Link
              key={i}
              to="/explore"
              className="group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-wadu-teal dark:hover:border-wadu-teal transition-all duration-300 hover:shadow-lg hover:shadow-wadu-teal/5"
            >
              <div className="h-28 relative overflow-hidden bg-slate-100 dark:bg-slate-950">
                <img
                  src={`/image ${((i) % 10) + 6}.jpg`}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent flex items-end p-4">
                  <span className="text-3xl z-10">{city.emoji}</span>
                </div>
              </div>
              <div className="p-5 bg-white dark:bg-slate-900 transition-colors duration-300">
                <h3 className="text-wadu-navy dark:text-white font-bold group-hover:text-wadu-teal transition duration-200">
                  {city.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 mt-1 font-medium">
                  <MapPin size={12} className="text-wadu-teal" /> {city.country}
                </p>
                <p className="text-wadu-purple text-xs font-bold mt-2">
                  {city.count}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-wadu-navy dark:text-white mb-3">
            Don't see your city?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 font-semibold">
            We're expanding every day. Search for events in any location.
          </p>
          <Link
            to="/explore"
            className="inline-block bg-wadu-navy border border-wadu-navy/15 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal transition duration-200 shadow-sm"
          >
            Search All Locations
          </Link>
        </div>
      </section>
    </Layout>
  );
}
