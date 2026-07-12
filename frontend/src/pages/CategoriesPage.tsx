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
      <section className="bg-wadu-yellow border-b-8 border-wadu-black py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="inline-block bg-wadu-black text-wadu-yellow font-extrabold text-sm uppercase tracking-widest px-4 py-1 mb-6 transform -skew-x-12">
              Browse by Category
            </p>
            <h1 className="text-5xl md:text-7xl font-display font-black text-wadu-black mb-6 uppercase leading-none">
              Find Your Scene
            </h1>
            <p className="text-wadu-black text-xl md:text-2xl font-bold max-w-2xl leading-relaxed uppercase">
              From pulsing concerts to insightful conferences - explore thousands
              of events across every category.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-none h-16 w-16 border-8 border-wadu-black border-t-wadu-yellow mx-auto mb-6"></div>
            <p className="text-wadu-black font-black uppercase text-2xl">Loading Categories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={i}
                  to={`/explore`}
                  className="group bg-white border-4 border-wadu-black rounded-none p-8 hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 hover:border-wadu-black shadow-[8px_8px_0px_0px_rgba(5,5,5,1)] hover:shadow-[12px_12px_0px_0px_rgba(5,5,5,1)] flex flex-col items-start"
                >
                  <div
                    className="w-16 h-16 rounded-none bg-wadu-black flex items-center justify-center mb-6 group-hover:bg-wadu-yellow transition-colors duration-200 border-2 border-wadu-black"
                  >
                    <Icon className="w-8 h-8 text-white group-hover:text-wadu-black transition-colors duration-200" />
                  </div>
                  <h3 className="text-wadu-black font-black mb-2 text-xl md:text-2xl uppercase leading-tight group-hover:text-wadu-yellow group-hover:underline transition duration-200">
                    {cat.label}
                  </h3>
                  <p className="text-wadu-black font-bold text-sm uppercase">{cat.count}</p>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="bg-wadu-black py-24 px-4 border-t-8 border-wadu-black text-center relative">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-black text-wadu-yellow mb-6 uppercase leading-tight">
            Can't find your category?
          </h2>
          <p className="text-white mb-10 max-w-xl mx-auto text-xl font-bold uppercase">
            Search across all events or browse by city to discover something new.
          </p>
          <Link
            to="/explore"
            className="inline-block bg-wadu-yellow border-4 border-wadu-black text-wadu-black px-10 py-5 rounded-none font-black uppercase text-xl hover:bg-white hover:text-wadu-black transition duration-200 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]"
          >
            Explore All Events
          </Link>
        </div>
      </section>
    </Layout>
  );
}
