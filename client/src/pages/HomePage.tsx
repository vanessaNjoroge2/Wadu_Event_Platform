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
  Plus,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function Index() {
  const categories = [
    { icon: Music, label: "Concerts", color: "from-purple-500 to-pink-500" },
    {
      icon: Megaphone,
      label: "Conferences",
      color: "from-blue-500 to-cyan-500",
    },
    { icon: Tent, label: "Festivals", color: "from-green-500 to-teal-500" },
    { icon: Trophy, label: "Sports", color: "from-orange-500 to-red-500" },
    { icon: Users, label: "Networking", color: "from-pink-500 to-rose-500" },
    { icon: Palette, label: "Exhibitions", color: "from-indigo-500 to-purple-500" },
    {
      icon: Utensils,
      label: "Food & Drink",
      color: "from-yellow-500 to-orange-500",
    },
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
      gradient: "from-purple-600 to-pink-600",
    },
    {
      id: 2,
      title: "East Africa Tech Summit",
      location: "Kigali, Rwanda",
      date: "Mon, Oct 20, 2025 • 9:00 AM",
      price: "From KES 2,000",
      category: "TECH",
      tag: "TRENDING",
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: 3,
      title: "Lamu Cultural Festival",
      location: "Lamu, Kenya",
      date: "Sat, Nov 15, 2025 • 10:00 AM",
      price: "From KES 1,200",
      category: "CULTURE",
      tag: "TRENDING",
      gradient: "from-teal-500 to-green-500",
    },
    {
      id: 4,
      title: "Nairobi Food Market",
      location: "Nairobi, Kenya",
      date: "Sun, Nov 26, 2025 • 12:00 PM",
      price: "From KES 1,500",
      category: "FOOD & DRINK",
      tag: "TRENDING",
      gradient: "from-red-500 to-pink-600",
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
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Browse by Category
        </h2>
        <p className="text-gray-400 mb-12">
          Find events that match your interests.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 7).map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={index}
                to="/explore"
                className={`group relative p-6 rounded-2xl bg-gradient-to-br ${category.color} overflow-hidden transition-all hover:shadow-lg hover:shadow-purple-500/20 ${
                  index === 0
                    ? "col-span-2 md:col-span-1 md:row-span-2"
                    : ""
                }`}
              >
                <div className="relative z-10">
                  <Icon className="w-8 h-8 text-white mb-3" />
                  <p className="text-white font-semibold">{category.label}</p>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
          How It Works
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          Simple. Seamless. Secure.
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* For Attendees */}
          <div className="bg-white/5 backdrop-blur border border-slate-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Users className="text-purple-400" size={28} />
              For Attendees
            </h3>
            <div className="space-y-6">
              {[
                { num: 1, title: "Discover events.", icon: "🔍" },
                { num: 2, title: "Book securely.", icon: "🎫" },
                { num: 3, title: "Attend and enjoy!", icon: "✓" },
              ].map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex-shrink-0">
                    <span className="text-white font-bold">{step.num}</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-gray-300 font-medium">{step.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Organizers */}
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Megaphone className="text-purple-300" size={28} />
              For Organizers
            </h3>
            <div className="space-y-6">
              {[
                { num: 1, title: "Create event.", icon: "+" },
                { num: 2, title: "Promote & Sell.", icon: "📢" },
                { num: 3, title: "Manage & Analyze.", icon: "📊" },
              ].map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex-shrink-0">
                    <span className="text-slate-950 font-bold">{step.num}</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-gray-200 font-medium">{step.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Events */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-sm font-semibold text-teal-400 uppercase tracking-widest mb-2">
              Trending Now
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Events You Can't Miss
            </h2>
            <p className="text-gray-400 mt-2">
              Curated picks from around the globe
            </p>
          </div>
          <Link
            to="/explore"
            className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2"
          >
            View All Events <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {trendingEvents.map((event) => (
            <Link
              key={event.id}
              to={`/event/${event.id}`}
              className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-purple-500 transition hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className={`h-40 bg-gradient-to-br ${event.gradient} relative overflow-hidden`}>
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className="bg-slate-950/80 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold">
                    {event.category}
                  </span>
                  <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-semibold">
                    {event.tag}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition">
                  {event.title}
                </h3>
                <div className="space-y-2 text-sm text-gray-400 mb-4">
                  <p>📍 {event.location}</p>
                  <p>📅 {event.date}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-white">{event.price}</p>
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition text-sm">
                    Get Ticket
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/explore"
            className="inline-block bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-600 transition"
          >
            View All Events
          </Link>
        </div>
      </section>

      {/* App Promotion */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-teal-400 font-semibold text-sm uppercase tracking-widest mb-4">
              WADU MOBILE
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Your Events, In Your Pocket
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Discover, book, and manage your event tickets anytime, anywhere.
              Get the app for seamless access.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-black border border-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 13.5c-.91 0-1.64.75-1.64 1.67s.73 1.67 1.64 1.67 1.64-.75 1.64-1.67-.73-1.67-1.64-1.67zm-7-7h4V2h-4v4.5zM6.05 13.5c-.91 0-1.64.75-1.64 1.67s.73 1.67 1.64 1.67 1.64-.75 1.64-1.67-.73-1.67-1.64-1.67z" />
                </svg>
                Download on the App Store
              </button>
              <button className="bg-black border border-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 13.5v8.25A1.5 1.5 0 004.5 23h15A1.5 1.5 0 0021 21.75V13.5M1 5.5A1.5 1.5 0 012.5 4h19A1.5 1.5 0 0123 5.5v2H1v-2z" />
                </svg>
                GET IT ON Google Play
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              4.9-star rating on App Store & Google Play
            </p>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="bg-gradient-to-b from-purple-600 to-pink-600 rounded-3xl p-1 w-64">
              <div className="bg-slate-950 rounded-3xl p-4 h-96 flex flex-col items-center justify-center">
                <p className="text-gray-400">Mobile App Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Host Your Next Event?
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Simplify ticketing, engage attendees, and grow your event with WADU.
        </p>
        <Link
          to="/post-event"
          className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition text-lg"
        >
          Start Selling Tickets
        </Link>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                {stat.value}
              </p>
              <p className="text-gray-400 text-sm uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
