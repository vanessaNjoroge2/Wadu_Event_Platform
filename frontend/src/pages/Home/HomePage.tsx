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
  ArrowRight,
} from "lucide-react";

export default function Index() {
  const categories = [
    { icon: Music, label: "Concerts" },
    { icon: Megaphone, label: "Conferences" },
    { icon: Tent, label: "Festivals" },
    { icon: Trophy, label: "Sports" },
    { icon: Users, label: "Networking" },
    { icon: Palette, label: "Exhibitions" },
    { icon: Utensils, label: "Food & Drink" },
  ];

  const trendingEvents = [
    {
      id: 1,
      title: "AfroNation Nairobi 2025",
      location: "Nairobi, Kenya",
      date: "Fri, Dec 1, 2025 • 5:00 PM",
      price: "From KES 3,500",
      category: "MUSIC",
      tag: "TRENDING",
      image: "/Image 1.jpg",
    },
    {
      id: 2,
      title: "East Africa Tech Summit",
      location: "Kigali, Rwanda",
      date: "Mon, Oct 20, 2025 • 9:00 AM",
      price: "From KES 2,000",
      category: "TECH",
      tag: "TRENDING",
      image: "/image 2.jpg",
    },
    {
      id: 3,
      title: "Lamu Cultural Festival",
      location: "Lamu, Kenya",
      date: "Sat, Nov 15, 2025 • 10:00 AM",
      price: "From KES 1,200",
      category: "CULTURE",
      tag: "TRENDING",
      image: "/image 3.jpg",
    },
    {
      id: 4,
      title: "Nairobi Food Market",
      location: "Nairobi, Kenya",
      date: "Sun, Nov 26, 2025 • 12:00 PM",
      price: "From KES 1,500",
      category: "FOOD & DRINK",
      tag: "TRENDING",
      image: "/image 4.jpg",
    },
  ];

  const stats = [
    { value: "10M+", label: "TICKETS SOLD" },
    { value: "50,000+", label: "EVENTS" },
    { value: "190+", label: "COUNTRIES" },
  ];

  return (
    <Layout showHero>
      {/* Browse by Category */}
      <section className="py-24 md:py-32 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-wadu-navy dark:text-white mb-2">
          Browse by Category
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-12">
          Find events that match your interests.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.slice(0, 7).map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={index}
                to="/explore"
                className={`group relative p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:border-wadu-teal dark:hover:border-wadu-teal hover:shadow-lg hover:shadow-wadu-teal/5 ${
                  index === 0
                    ? "col-span-2 md:col-span-1 md:row-span-2 flex flex-col justify-between"
                    : ""
                }`}
              >
                <div className="relative z-10">
                  <Icon className="w-10 h-10 text-wadu-purple group-hover:text-wadu-teal mb-4 transition duration-200" />
                  <p className="text-wadu-navy dark:text-white font-bold text-lg group-hover:text-wadu-teal transition duration-200">
                    {category.label}
                  </p>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-wadu-navy/[0.02] group-hover:bg-wadu-navy/[0.04] dark:bg-wadu-dark/30 dark:group-hover:bg-wadu-dark/50 transition duration-200" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 md:py-32 px-4 max-w-7xl mx-auto border-t border-slate-200/60 dark:border-slate-800/60">
        <h2 className="text-3xl md:text-4xl font-extrabold text-wadu-navy dark:text-white mb-4 text-center">
          How It Works
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-16 max-w-2xl mx-auto">
          Simple. Seamless. Secure.
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* For Attendees */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 shadow-sm transition duration-300">
            <h3 className="text-2xl font-bold text-wadu-navy dark:text-white mb-8 flex items-center gap-3">
              <Users className="text-wadu-purple animate-pulse" size={28} />
              For Attendees
            </h3>
            <div className="space-y-6">
              {[
                { num: 1, title: "Discover events.", desc: "Search and filter thousands of occurrences." },
                { num: 2, title: "Book securely.", desc: "Pay with M-Pesa, Card, or PayPal instantly." },
                { num: 3, title: "Attend and enjoy!", desc: "Access your digital tickets on your phone." },
              ].map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-wadu-purple text-white font-bold flex-shrink-0">
                    <span>{step.num}</span>
                  </div>
                  <div>
                    <p className="text-wadu-navy dark:text-white font-bold text-base">{step.title}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Organizers */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 shadow-sm transition duration-300">
            <h3 className="text-2xl font-bold text-wadu-navy dark:text-white mb-8 flex items-center gap-3">
              <Megaphone className="text-wadu-teal" size={28} />
              For Organizers
            </h3>
            <div className="space-y-6">
              {[
                { num: 1, title: "Create event.", desc: "Setup your ticket tiers and details in minutes." },
                { num: 2, title: "Promote & Sell.", desc: "Reach active crowds and check out effortlessly." },
                { num: 3, title: "Manage & Analyze.", desc: "Track sales and user profiles in real-time." },
              ].map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-wadu-navy dark:bg-slate-850 text-white dark:text-wadu-teal border border-wadu-teal/20 font-bold flex-shrink-0">
                    <span>{step.num}</span>
                  </div>
                  <div>
                    <p className="text-wadu-navy dark:text-white font-bold text-base">{step.title}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Events */}
      <section className="py-24 md:py-32 px-4 max-w-7xl mx-auto border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16">
          <div>
            <p className="text-sm font-extrabold text-wadu-teal uppercase tracking-widest mb-2">
              Trending Now
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-wadu-navy dark:text-white">
              Events You Can't Miss
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Curated picks from around the globe
            </p>
          </div>
          <Link
            to="/explore"
            className="text-wadu-purple hover:text-wadu-teal font-extrabold flex items-center gap-2 transition duration-200 group"
          >
            View All Events{" "}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {trendingEvents.map((event) => (
            <Link
              key={event.id}
              to={`/event/${event.id}`}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-wadu-teal transition duration-300 shadow-sm hover:shadow-lg hover:shadow-wadu-teal/5"
            >
              <div className="h-48 relative overflow-hidden bg-slate-100 dark:bg-slate-950">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <span className="bg-wadu-purple text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {event.category}
                  </span>
                  <span className="bg-wadu-navy text-wadu-teal border border-wadu-teal/30 px-3 py-1 rounded-full text-xs font-bold shadow-sm bg-opacity-95">
                    {event.tag}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-wadu-navy dark:text-white mb-2 group-hover:text-wadu-teal transition duration-200">
                  {event.title}
                </h3>
                <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                  <p>📍 {event.location}</p>
                  <p>📅 {event.date}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="font-extrabold text-wadu-navy dark:text-white text-base">{event.price}</p>
                  <button className="bg-wadu-navy border border-wadu-navy/15 text-white hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal px-4 py-2 rounded-lg font-bold transition duration-200 text-sm">
                    Get Ticket
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/explore"
            className="inline-block bg-wadu-navy border border-wadu-navy/15 text-white px-8 py-3 rounded-lg font-bold hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal transition duration-200 shadow-sm"
          >
            View All Events
          </Link>
        </div>
      </section>

      {/* App Promotion */}
      <section className="bg-white dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800/80 py-24 px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-wadu-purple font-extrabold text-sm uppercase tracking-widest mb-4">
              WADU MOBILE
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-wadu-navy dark:text-white mb-6 leading-tight">
              Your Events, In Your Pocket
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Discover, book, and manage your event tickets anytime, anywhere.
              Get the app for seamless access.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <button className="bg-wadu-navy border border-wadu-navy hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal text-white px-6 py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-3 min-w-[160px] duration-200">
                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span className="text-left">
                  <span className="block text-[10px] leading-none opacity-80">Download on the</span>
                  <span className="block text-sm font-bold">App Store</span>
                </span>
              </button>
              <button className="bg-wadu-navy border border-wadu-navy hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal text-white px-6 py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-3 min-w-[160px] duration-200">
                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.3.17.65.19.98.07l12.47-7.15-2.63-2.63-10.82 9.71zm-1.7-20.1C1.18 4.04 1 4.54 1 5.11v13.78c0 .57.18 1.07.48 1.45l.08.07 7.72-7.72v-.18L1.56 4.79l-.08.87zm16.18 9.18l-2.64-1.52-2.95 2.95 2.95 2.95 2.66-1.54c.76-.44.76-1.4-.02-1.84zM4.16.55L16.63 7.7 14 10.33 3.18.62A1.1 1.1 0 014.16.55z" />
                </svg>
                <span className="text-left">
                  <span className="block text-[10px] leading-none opacity-80">GET IT ON</span>
                  <span className="block text-sm font-bold">Google Play</span>
                </span>
              </button>
            </div>
            <p className="text-slate-400 text-sm mt-4">
              4.9-star rating on App Store &amp; Google Play
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="bg-[#0A1F44] rounded-[2.5rem] p-2 shadow-2xl w-56 border-4 border-wadu-navy/80">
                <div className="bg-wadu-dark rounded-[2rem] overflow-hidden border border-white/5">
                  <div className="bg-[#0A1F44] px-4 pt-4 pb-2 flex items-center justify-between">
                    <span className="text-white font-extrabold text-sm">WADU</span>
                    <span className="text-slate-300 text-xs">🔔</span>
                  </div>
                  <div className="px-4 pb-2">
                    <p className="text-slate-400 text-xs font-semibold mb-2">Upcoming</p>
                    <div className="h-20 bg-wadu-purple rounded-xl mb-2 flex items-end p-2 border border-white/5">
                      <p className="text-white text-[10px] font-bold">Your Events In Your Pocket</p>
                    </div>
                    {[
                      { title: "AfroNation Nairobi", time: "Dec 1 • 5:00 PM" },
                      { title: "EA Tech Summit", time: "Oct 20 • 9:00 AM" },
                      { title: "Lamu Festival", time: "Nov 15 • 10:00 AM" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 mb-1.5">
                        <div className="w-8 h-8 rounded-lg bg-wadu-navy flex items-center justify-center text-xs font-bold text-wadu-teal flex-shrink-0">
                          🎫
                        </div>
                        <div>
                          <p className="text-white text-[9px] font-bold leading-tight">{item.title}</p>
                          <p className="text-slate-400 text-[8px]">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-800 px-4 py-2 flex justify-around">
                    {["Home", "Events", "Notifs", "Settings"].map((t) => (
                      <span key={t} className="text-slate-500 text-[8px]">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-wadu-purple py-24 px-4 text-center shadow-lg transition duration-300">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Ready to Host Your Next Event?
        </h2>
        <p className="text-purple-100 text-lg mb-8 max-w-xl mx-auto">
          Simplify ticketing, engage attendees, and grow your event with WADU.
        </p>
        <Link
          to="/post-event"
          className="inline-block bg-wadu-navy border border-wadu-navy/10 text-white px-10 py-4 rounded-xl font-bold hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal transition text-lg shadow-lg duration-200"
        >
          Start Selling Tickets
        </Link>
      </section>

      {/* Stats */}
      <section className="py-24 px-4 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl md:text-5xl font-extrabold text-wadu-purple mb-2">
                {stat.value}
              </p>
              <p className="text-slate-400 text-sm uppercase tracking-widest font-semibold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
