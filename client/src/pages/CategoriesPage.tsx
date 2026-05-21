import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import {
  Music,
  Megaphone,
  Tent,
  Trophy,
  Users,
  Palette,
  Utensils,
  Laptop,
  Heart,
  Camera,
  BookOpen,
  Zap,
} from "lucide-react";

const categories = [
  {
    icon: Music,
    label: "Concerts & Music",
    count: "1,240 events",
    color: "from-purple-600 to-pink-600",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: Laptop,
    label: "Tech & Innovation",
    count: "380 events",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Tent,
    label: "Festivals",
    count: "215 events",
    color: "from-green-500 to-teal-500",
    bg: "bg-green-500/10 border-green-500/20",
  },
  {
    icon: Trophy,
    label: "Sports & Fitness",
    count: "430 events",
    color: "from-orange-500 to-red-500",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    icon: Users,
    label: "Networking",
    count: "190 events",
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-500/10 border-pink-500/20",
  },
  {
    icon: Palette,
    label: "Arts & Exhibitions",
    count: "160 events",
    color: "from-indigo-500 to-purple-500",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: Utensils,
    label: "Food & Drink",
    count: "310 events",
    color: "from-yellow-500 to-orange-500",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    icon: Megaphone,
    label: "Conferences",
    count: "275 events",
    color: "from-cyan-500 to-blue-500",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Heart,
    label: "Charity & Causes",
    count: "95 events",
    color: "from-red-500 to-pink-500",
    bg: "bg-red-500/10 border-red-500/20",
  },
  {
    icon: Camera,
    label: "Film & Media",
    count: "72 events",
    color: "from-slate-500 to-gray-600",
    bg: "bg-slate-500/10 border-slate-500/20",
  },
  {
    icon: BookOpen,
    label: "Education",
    count: "143 events",
    color: "from-teal-500 to-green-600",
    bg: "bg-teal-500/10 border-teal-500/20",
  },
  {
    icon: Zap,
    label: "Nightlife",
    count: "510 events",
    color: "from-fuchsia-500 to-purple-600",
    bg: "bg-fuchsia-500/10 border-fuchsia-500/20",
  },
];

export default function CategoriesPage() {
  return (
    <Layout>
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Browse by Category
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your Scene
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            From pulsing concerts to insightful conferences — explore thousands
            of events across every category.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link
                key={i}
                to={`/explore`}
                className={`group border ${cat.bg} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-bold mb-1 text-sm md:text-base leading-tight">
                  {cat.label}
                </h3>
                <p className="text-gray-500 text-xs">{cat.count}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="py-12 px-4 max-w-7xl mx-auto border-t border-slate-800">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            Can't find your category?
          </h2>
          <p className="text-gray-400 mb-6">
            Search across all events or browse by city to discover something
            new.
          </p>
          <Link
            to="/explore"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition"
          >
            Explore All Events
          </Link>
        </div>
      </section>
    </Layout>
  );
}
