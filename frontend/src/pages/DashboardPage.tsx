import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import {
  Ticket,
  Calendar,
  TrendingUp,
  Plus,
  MapPin,
  Clock,
  ArrowRight,
  Star,
} from "lucide-react";

const upcomingTickets = [
  {
    id: 1,
    title: "AfroNation Nairobi 2025",
    date: "Fri, Dec 1, 2025 • 5:00 PM",
    location: "Nairobi, Kenya",
    seat: "Section A · Row 3 · Seat 12",
    status: "Confirmed",
  },
  {
    id: 2,
    title: "East Africa Tech Summit",
    date: "Mon, Oct 20, 2025 • 9:00 AM",
    location: "Kigali, Rwanda",
    seat: "General Admission",
    status: "Confirmed",
  },
  {
    id: 3,
    title: "Lamu Cultural Festival",
    date: "Sat, Nov 15, 2025 • 10:00 AM",
    location: "Lamu, Kenya",
    seat: "VIP Pass",
    status: "Pending",
  },
];

const stats = [
  { label: "Tickets Purchased", value: "12", icon: Ticket, color: "text-wadu-purple" },
  { label: "Events Attended", value: "8", icon: Star, color: "text-wadu-teal" },
  { label: "Upcoming Events", value: "3", icon: Calendar, color: "text-wadu-purple" },
  { label: "Events Hosted", value: "1", icon: TrendingUp, color: "text-wadu-teal" },
];

export default function DashboardPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div>
            <p className="text-wadu-purple font-extrabold text-sm uppercase tracking-widest mb-1">
              My Account
            </p>
            <h1 className="text-4xl font-extrabold text-wadu-navy dark:text-white">Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Welcome back! Here's what's coming up.
            </p>
          </div>
          <Link
            to="/post-event"
            className="flex items-center gap-2 bg-wadu-purple text-white hover:bg-wadu-teal hover:text-wadu-navy px-6 py-3.5 rounded-xl font-bold transition duration-200 shadow-sm"
          >
            <Plus size={18} />
            Post an Event
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
              >
                <Icon className={`${stat.color} mb-3`} size={24} />
                <p className="text-3xl font-extrabold text-wadu-navy dark:text-white">{stat.value}</p>
                <p className="text-slate-550 dark:text-slate-400 text-sm mt-1 font-semibold">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-wadu-navy dark:text-white">My Tickets</h2>
              <Link
                to="/explore"
                className="text-wadu-purple hover:text-wadu-teal text-sm font-bold flex items-center gap-1 transition"
              >
                Browse Events <ArrowRight size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {upcomingTickets.map((ticket, i) => (
                <div
                  key={ticket.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-wadu-teal dark:hover:border-wadu-teal rounded-2xl overflow-hidden transition shadow-sm"
                >
                  <div className="flex">
                    <div
                      className={`w-2 ${i % 2 === 0 ? "bg-wadu-purple" : "bg-wadu-teal"} flex-shrink-0`}
                    />
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-wadu-navy dark:text-white font-bold mb-2">
                            {ticket.title}
                          </h3>
                          <div className="space-y-1 text-sm text-slate-500 dark:text-slate-400 font-semibold">
                            <p className="flex items-center gap-2">
                              <Clock size={14} className="text-wadu-teal" /> {ticket.date}
                            </p>
                            <p className="flex items-center gap-2">
                              <MapPin size={14} className="text-wadu-teal" /> {ticket.location}
                            </p>
                            <p className="flex items-center gap-2">
                              <Ticket size={14} className="text-wadu-teal" /> {ticket.seat}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-extrabold px-3 py-1 rounded-full flex-shrink-0 ${
                            ticket.status === "Confirmed"
                              ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                              : "bg-yellow-500/10 text-yellow-605 dark:text-yellow-400 border border-yellow-500/20"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-wadu-navy dark:text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              {[
                {
                  label: "Explore Events",
                  to: "/explore",
                  icon: Calendar,
                },
                {
                  label: "Browse Categories",
                  to: "/categories",
                  icon: Star,
                },
                {
                  label: "Find by City",
                  to: "/cities",
                  icon: MapPin,
                },
                {
                  label: "Host an Event",
                  to: "/post-event",
                  icon: Plus,
                },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={i}
                    to={action.to}
                    className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-wadu-teal dark:hover:border-wadu-teal rounded-xl p-4 transition group shadow-sm"
                  >
                    <div
                      className="w-10 h-10 rounded-lg bg-wadu-navy text-wadu-teal flex items-center justify-center flex-shrink-0 border border-white/5"
                    >
                      <Icon size={18} />
                    </div>
                    <span className="text-wadu-navy dark:text-white font-bold group-hover:text-wadu-teal transition duration-200">
                      {action.label}
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-slate-400 group-hover:text-wadu-teal ml-auto transition-all duration-200 group-hover:translate-x-0.5"
                    />
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 bg-wadu-purple border border-wadu-purple/20 rounded-2xl p-6 text-center text-white shadow-md transition duration-300">
              <p className="font-extrabold mb-2 text-lg">Get the WADU App</p>
              <p className="text-purple-100 text-sm mb-4 leading-relaxed font-semibold">
                Manage tickets on the go.
              </p>
              <div className="space-y-2">
                <button className="w-full bg-[#0A1F44] border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal transition duration-200 shadow-sm">
                  App Store
                </button>
                <button className="w-full bg-[#0A1F44] border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal transition duration-200 shadow-sm">
                  Google Play
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
