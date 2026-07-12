import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { EventCard } from "@/components/events/EventCard";
import {
  Music,
  Megaphone,
  Tent,
  Trophy,
  Users,
  Palette,
  Utensils,
  Laptop,
  ArrowRight,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const [availableEvents, setAvailableEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/explore?search=${encodeURIComponent(query.trim())}`);
    }
  };

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          const mapped = json.data.map((cat: any) => {
            const lowerName = cat.name.toLowerCase();
            let icon = Music;
            if (lowerName.includes("music") || lowerName.includes("concert")) icon = Music;
            else if (lowerName.includes("tech") || lowerName.includes("laptop")) icon = Laptop;
            else if (lowerName.includes("conference") || lowerName.includes("megaphone")) icon = Megaphone;
            else if (lowerName.includes("culture") || lowerName.includes("art") || lowerName.includes("palette")) icon = Palette;
            else if (lowerName.includes("sport") || lowerName.includes("trophy")) icon = Trophy;
            else if (lowerName.includes("network") || lowerName.includes("user")) icon = Users;
            else if (lowerName.includes("food") || lowerName.includes("drink")) icon = Utensils;
            else if (lowerName.includes("camp") || lowerName.includes("outdoor")) icon = Tent;
            return { icon, label: cat.name };
          });
          setCategories(mapped);
        }
      })
      .catch((err) => console.error("Error loading categories:", err));

    fetch("/api/events?limit=6")
      .then((res) => res.json())
      .then((json) => {
        if (json.data && json.data.events) {
          setAvailableEvents(json.data.events);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading events:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Layout showHero>

      {/* Search Bar — full width below hero */}
      <section className="bg-wadu-yellow border-b-8 border-wadu-black">
        <form
          onSubmit={handleSearch}
          className="max-w-4xl mx-auto flex flex-col sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-wadu-black" size={22} />
            <input
              type="text"
              placeholder="Search events, artists, venues..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white border-4 sm:border-r-0 border-b-4 sm:border-b-4 border-wadu-black py-4 pl-14 pr-5 text-wadu-black placeholder-slate-500 font-bold text-base focus:outline-none focus:bg-slate-50 transition-colors h-[64px]"
            />
          </div>
          <button
            type="submit"
            className="bg-wadu-black border-4 border-wadu-black hover:bg-white hover:text-wadu-black text-wadu-yellow px-8 font-black uppercase text-base transition-colors w-full sm:w-auto h-[64px] flex items-center justify-center gap-2"
          >
            <Search size={18} />
            Search
          </button>
        </form>
      </section>

      {/* Available Events */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-block bg-wadu-black text-wadu-yellow font-extrabold text-xs uppercase tracking-widest px-3 py-1 mb-3 transform -skew-x-12">
              Discover Now
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase text-wadu-black leading-none">
              Available Events
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-wadu-black hover:text-wadu-yellow font-black uppercase flex items-center gap-2 transition duration-200 group text-base sm:text-lg shrink-0"
          >
            View All <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin h-12 w-12 border-4 border-wadu-black border-t-wadu-yellow mx-auto mb-4"></div>
            <p className="text-wadu-black font-black uppercase">Loading Events...</p>
          </div>
        ) : availableEvents.length === 0 ? (
          <div className="text-center py-16 bg-wadu-yellow border-4 border-wadu-black max-w-md mx-auto p-8 shadow-[8px_8px_0px_0px_rgba(5,5,5,1)]">
            <p className="text-wadu-black font-black uppercase text-xl mb-2">No Events Yet</p>
            <p className="text-wadu-black/70 font-bold text-sm">Check back soon for upcoming events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {availableEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/explore"
            className="inline-block bg-wadu-black border-4 border-wadu-black text-wadu-yellow px-8 py-4 font-black uppercase text-base hover:bg-wadu-yellow hover:text-wadu-black transition duration-200 shadow-[6px_6px_0px_0px_rgba(238,255,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5"
          >
            Explore All Events
          </Link>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 md:py-24 px-4 bg-wadu-black border-t-8 border-wadu-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-display font-black uppercase text-white mb-2">
            Browse by Category
          </h2>
          <p className="text-slate-400 font-medium mb-10 text-base">
            Find events that match your vibe.
          </p>

          {categories.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                { icon: Music, label: "Music" },
                { icon: Laptop, label: "Tech" },
                { icon: Trophy, label: "Sports" },
                { icon: Palette, label: "Arts" },
                { icon: Utensils, label: "Food" },
                { icon: Users, label: "Networking" },
                { icon: Tent, label: "Outdoors" },
                { icon: Megaphone, label: "Conference" },
              ].map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={i}
                    to="/explore"
                    className="group p-6 bg-wadu-black border-4 border-white hover:border-wadu-yellow transition-all duration-200 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(238,255,0,1)]"
                  >
                    <Icon className="w-8 h-8 text-white group-hover:text-wadu-yellow mb-3 transition duration-200" />
                    <p className="text-white font-black uppercase text-base group-hover:text-wadu-yellow transition duration-200">
                      {cat.label}
                    </p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((category, index) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={index}
                    to="/explore"
                    className="group p-6 bg-wadu-black border-4 border-white hover:border-wadu-yellow transition-all duration-200 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(238,255,0,1)]"
                  >
                    <Icon className="w-8 h-8 text-white group-hover:text-wadu-yellow mb-3 transition duration-200" />
                    <p className="text-white font-black uppercase text-base group-hover:text-wadu-yellow transition duration-200">
                      {category.label}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 px-4 bg-white border-t-8 border-wadu-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase text-wadu-black mb-3">
              How It Works
            </h2>
            <p className="text-wadu-black/70 font-bold text-base uppercase tracking-widest">
              Simple. Seamless. Secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* For Attendees */}
            <div className="bg-wadu-yellow border-4 border-wadu-black p-8 shadow-[8px_8px_0px_0px_rgba(5,5,5,1)]">
              <h3 className="text-2xl font-black uppercase text-wadu-black mb-8 flex items-center gap-3">
                <Users className="text-wadu-black shrink-0" size={28} />
                For Attendees
              </h3>
              <div className="space-y-6">
                {[
                  { num: 1, title: "Discover events.", desc: "Search and filter thousands of events near you." },
                  { num: 2, title: "Book securely.", desc: "Pay with M-Pesa, Card, or PayPal instantly." },
                  { num: 3, title: "Attend and enjoy!", desc: "Access your digital tickets anytime." },
                ].map((step) => (
                  <div key={step.num} className="flex gap-5 items-start">
                    <div className="flex items-center justify-center w-12 h-12 bg-wadu-black text-wadu-yellow font-black text-xl shrink-0 transform -skew-x-12">
                      <span className="transform skew-x-12">{step.num}</span>
                    </div>
                    <div>
                      <p className="text-wadu-black font-black uppercase text-lg">{step.title}</p>
                      <p className="text-wadu-black/80 font-medium text-sm mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Organizers */}
            <div className="bg-wadu-black border-4 border-wadu-black p-8 shadow-[8px_8px_0px_0px_rgba(238,255,0,1)]">
              <h3 className="text-2xl font-black uppercase text-wadu-yellow mb-8 flex items-center gap-3">
                <Megaphone className="text-wadu-yellow shrink-0" size={28} />
                For Organizers
              </h3>
              <div className="space-y-6">
                {[
                  { num: 1, title: "Create event.", desc: "Set up ticket tiers and details in minutes." },
                  { num: 2, title: "Promote & Sell.", desc: "Reach active crowds and collect revenue easily." },
                  { num: 3, title: "Manage & Analyze.", desc: "Track sales and attendees in real-time." },
                ].map((step) => (
                  <div key={step.num} className="flex gap-5 items-start">
                    <div className="flex items-center justify-center w-12 h-12 bg-wadu-yellow text-wadu-black font-black text-xl shrink-0 transform -skew-x-12">
                      <span className="transform skew-x-12">{step.num}</span>
                    </div>
                    <div>
                      <p className="text-white font-black uppercase text-lg">{step.title}</p>
                      <p className="text-slate-400 font-medium text-sm mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-wadu-black py-16 md:py-24 px-4 border-t-8 border-wadu-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-wadu-yellow opacity-5 transform rotate-45 translate-x-32 -translate-y-16 pointer-events-none"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-block bg-wadu-yellow text-wadu-black font-extrabold text-xs uppercase tracking-widest px-3 py-1 mb-5 transform -skew-x-12">
            Stay In The Loop
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white mb-4 uppercase leading-tight">
            Never Miss<br /><span className="text-wadu-yellow">An Event</span>
          </h2>
          <p className="text-slate-400 font-medium mb-8 text-base max-w-xl mx-auto">
            Get exclusive early access to ticket drops, lineup reveals, and special promotions straight to your inbox.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}
            className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto shadow-[6px_6px_0px_0px_rgba(238,255,0,1)]"
          >
            <input
              type="email"
              placeholder="your@email.com"
              required
              className="flex-1 bg-white border-4 sm:border-r-0 border-wadu-black py-4 px-5 text-wadu-black font-bold text-base focus:outline-none h-[58px] placeholder-slate-400"
            />
            <button
              type="submit"
              className="bg-wadu-yellow border-4 border-wadu-black hover:bg-white text-wadu-black px-7 font-black uppercase text-sm transition-colors h-[58px]"
            >
              Subscribe
            </button>
          </form>
          <p className="text-slate-600 font-bold text-xs mt-4 uppercase tracking-wider">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-wadu-yellow py-16 md:py-24 px-4 text-center border-t-8 border-wadu-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-display font-black text-wadu-black mb-4 uppercase leading-none">
            Ready to Host<br />Your Next Event?
          </h2>
          <p className="text-wadu-black/80 font-bold text-base md:text-xl mb-10 max-w-xl mx-auto">
            Simplify ticketing, engage attendees, and grow your event with WADU.
          </p>
          <Link
            to="/post-event"
            className="inline-block bg-wadu-black border-4 border-wadu-black text-wadu-yellow px-10 py-5 font-black hover:bg-white hover:text-wadu-black transition text-lg uppercase shadow-[8px_8px_0px_0px_rgba(5,5,5,1)] hover:-translate-y-1 hover:-translate-x-1 duration-200"
          >
            Start Selling Tickets →
          </Link>
        </div>
      </section>
    </Layout>
  );
}
