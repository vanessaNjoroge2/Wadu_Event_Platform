import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useState, useEffect } from "react";

export default function CitiesPage() {
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cities")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          const mapped = json.data.map((city: any) => ({
            name: city.name,
            country: "Kenya", // All seeded cities are in Kenya
            count: `${city.count} event${city.count === 1 ? "" : "s"}`,
          }));
          setCities(mapped);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading cities:", err);
        setLoading(false);
      });
  }, []);

  const regions = ["All", "East Africa"];

  return (
    <Layout>
      <section className="bg-wadu-yellow border-b-8 border-wadu-black py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="inline-block bg-wadu-black text-wadu-yellow font-extrabold text-sm uppercase tracking-widest px-4 py-1 mb-6 transform -skew-x-12">
              Browse by Location
            </p>
            <h1 className="text-5xl md:text-7xl font-display font-black text-wadu-black mb-6 uppercase leading-none">
              Events Near You
            </h1>
            <p className="text-wadu-black text-xl md:text-2xl font-bold max-w-2xl leading-relaxed uppercase">
              Discover live events happening in cities across East Africa.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {regions.map((r) => (
              <button
                key={r}
                className={`px-6 py-3 rounded-none text-lg font-black uppercase border-4 border-wadu-black transition duration-200 ${
                  r === "All"
                    ? "bg-wadu-black text-wadu-yellow shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] translate-y-1 translate-x-1"
                    : "bg-white text-wadu-black shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] hover:bg-wadu-black hover:text-wadu-yellow hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-none h-16 w-16 border-8 border-wadu-black border-t-wadu-yellow mx-auto mb-6"></div>
            <p className="text-wadu-black font-black uppercase text-2xl">Loading Cities...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {cities.map((city, i) => (
              <Link
                key={i}
                to="/explore"
                className="group relative rounded-none flex flex-col bg-white border-4 border-wadu-black hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(5,5,5,1)] hover:shadow-[12px_12px_0px_0px_rgba(5,5,5,1)]"
              >
                <div className="h-40 relative overflow-hidden bg-slate-100 border-b-4 border-wadu-black">
                  <img
                    src={`/image ${((i) % 10) + 6}.jpg`}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-wadu-black font-black bg-wadu-yellow border-2 border-wadu-black px-3 py-1 uppercase shadow-[4px_4px_0px_0px_rgba(5,5,5,1)]">
                      CITY
                    </span>
                  </div>
                </div>
                <div className="p-6 bg-white transition-colors duration-300 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-wadu-black font-black text-2xl uppercase group-hover:text-wadu-yellow group-hover:underline transition duration-200">
                      {city.name}
                    </h3>
                    <p className="text-wadu-black text-sm flex items-center gap-2 mt-2 font-bold uppercase">
                      <MapPin size={16} className="text-wadu-black" /> {city.country}
                    </p>
                  </div>
                  <p className="text-wadu-black text-base font-black mt-6 border-t-2 border-wadu-black pt-4 uppercase">
                    {city.count}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-wadu-black py-24 px-4 border-t-8 border-wadu-black text-center relative">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-black text-wadu-yellow mb-6 uppercase leading-tight">
            Don't see your city?
          </h2>
          <p className="text-white mb-10 max-w-xl mx-auto text-xl font-bold uppercase">
            We are expanding every day. Search for events in any location.
          </p>
          <Link
            to="/explore"
            className="inline-block bg-wadu-yellow border-4 border-wadu-black text-wadu-black px-10 py-5 rounded-none font-black uppercase text-xl hover:bg-white hover:text-wadu-black transition duration-200 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]"
          >
            Search All Locations
          </Link>
        </div>
      </section>
    </Layout>
  );
}
