import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
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

const iconMap: Record<string, any> = {
  music: Music,
  technology: Laptop,
  festivals: Tent,
  sports: Trophy,
  networking: Users,
  art: Palette,
  culture: Palette,
  food: Utensils,
  conferences: Megaphone,
  fashion: Heart,
  media: Camera,
  education: BookOpen,
  nightlife: Zap,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          const mapped = json.data.map((cat: any) => {
            const key = cat.name.toLowerCase();
            let matchedIcon = Music;
            for (const mapKey of Object.keys(iconMap)) {
              if (key.includes(mapKey)) {
                matchedIcon = iconMap[mapKey];
                break;
              }
            }
            return {
              label: cat.name,
              count: `${cat.count} event${cat.count === 1 ? "" : "s"}`,
              icon: matchedIcon,
            };
          });
          setCategories(mapped);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading categories:", err);
        setLoading(false);
      });
  }, []);

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
            From pulsing concerts to insightful conferences - explore thousands
            of events across every category.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wadu-purple mx-auto"></div>
          </div>
        ) : (
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
        )}
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
