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
  },
  {
    icon: Laptop,
    label: "Tech & Innovation",
    count: "380 events",
  },
  {
    icon: Tent,
    label: "Festivals",
    count: "215 events",
  },
  {
    icon: Trophy,
    label: "Sports & Fitness",
    count: "430 events",
  },
  {
    icon: Users,
    label: "Networking",
    count: "190 events",
  },
  {
    icon: Palette,
    label: "Arts & Exhibitions",
    count: "160 events",
  },
  {
    icon: Utensils,
    label: "Food & Drink",
    count: "310 events",
  },
  {
    icon: Megaphone,
    label: "Conferences",
    count: "275 events",
  },
  {
    icon: Heart,
    label: "Charity & Causes",
    count: "95 events",
  },
  {
    icon: Camera,
    label: "Film & Media",
    count: "72 events",
  },
  {
    icon: BookOpen,
    label: "Education",
    count: "143 events",
  },
  {
    icon: Zap,
    label: "Nightlife",
    count: "510 events",
  },
];

export default function CategoriesPage() {
  return (
    <Layout>
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-wadu-purple font-extrabold text-sm uppercase tracking-widest mb-3">
            Browse by Category
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-wadu-navy dark:text-white mb-4">
            Find Your Scene
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
            From pulsing concerts to insightful conferences — explore thousands
            of events across every category.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link
                key={i}
                to={`/explore`}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 hover:border-wadu-teal dark:hover:border-wadu-teal hover:shadow-lg hover:shadow-wadu-teal/5"
              >
                <div
                  className="w-12 h-12 rounded-xl bg-wadu-purple/10 dark:bg-wadu-purple/20 flex items-center justify-center mb-4 group-hover:bg-wadu-teal/10 transition-colors duration-255"
                >
                  <Icon className="w-6 h-6 text-wadu-purple group-hover:text-wadu-teal transition-colors duration-255" />
                </div>
                <h3 className="text-wadu-navy dark:text-white font-bold mb-1 text-sm md:text-base leading-tight group-hover:text-wadu-teal transition duration-200">
                  {cat.label}
                </h3>
                <p className="text-slate-450 dark:text-slate-500 text-xs font-semibold">{cat.count}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="bg-wadu-purple border border-wadu-purple/25 rounded-2xl p-10 text-center text-white shadow-lg">
          <h2 className="text-3xl font-extrabold text-white mb-3">
            Can't find your category?
          </h2>
          <p className="text-purple-100 mb-6 max-w-xl mx-auto text-base">
            Search across all events or browse by city to discover something
            new.
          </p>
          <Link
            to="/explore"
            className="inline-block bg-wadu-navy border border-wadu-navy/15 text-white px-8 py-3 rounded-xl font-bold hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal transition duration-200"
          >
            Explore All Events
          </Link>
        </div>
      </section>
    </Layout>
  );
}
