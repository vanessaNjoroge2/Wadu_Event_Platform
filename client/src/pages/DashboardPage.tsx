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
    gradient: "from-purple-600 to-pink-600",
    status: "Confirmed",
  },
  {
    id: 2,
    title: "East Africa Tech Summit",
    date: "Mon, Oct 20, 2025 • 9:00 AM",
    location: "Kigali, Rwanda",
    seat: "General Admission",
    gradient: "from-orange-500 to-red-500",
    status: "Confirmed",
  },
  {
    id: 3,
    title: "Lamu Cultural Festival",
    date: "Sat, Nov 15, 2025 • 10:00 AM",
    location: "Lamu, Kenya",
    seat: "VIP Pass",
    gradient: "from-teal-500 to-green-500",
    status: "Pending",
  },
];

const stats = [
  { label: "Tickets Purchased", value: "12", icon: Ticket, color: "text-purple-400" },
  { label: "Events Attended", value: "8", icon: Star, color: "text-yellow-400" },
  { label: "Upcoming Events", value: "3", icon: Calendar, color: "text-teal-400" },
  { label: "Events Hosted", value: "1", icon: TrendingUp, color: "text-pink-400" },
];

export default function DashboardPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div>
            <p className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-1">
              My Account
            </p>
            <h1 className="text-4xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Welcome back! Here's what's coming up.
            </p>
          </div>
          <Link
            to="/post-event"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-bold transition"
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
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
              >
                <Icon className={`${stat.color} mb-3`} size={24} />
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">My Tickets</h2>
              <Link
                to="/explore"
                className="text-purple-400 hover:text-purple-300 text-sm font-semibold flex items-center gap-1"
              >
                Browse Events <ArrowRight size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {upcomingTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-slate-800/50 border border-slate-700 hover:border-purple-500 rounded-2xl overflow-hidden transition"
                >
                  <div className="flex">
                    <div
                      className={`w-2 bg-gradient-to-b ${ticket.gradient} flex-shrink-0`}
                    />
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-white font-bold mb-2">
                            {ticket.title}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-400">
                            <p className="flex items-center gap-2">
                              <Clock size={14} /> {ticket.date}
                            </p>
                            <p className="flex items-center gap-2">
                              <MapPin size={14} /> {ticket.location}
                            </p>
                            <p className="flex items-center gap-2">
                              <Ticket size={14} /> {ticket.seat}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${
                            ticket.status === "Confirmed"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
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
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              {[
                {
                  label: "Explore Events",
                  to: "/explore",
                  icon: Calendar,
                  color: "from-purple-600 to-pink-600",
                },
                {
                  label: "Browse Categories",
                  to: "/categories",
                  icon: Star,
                  color: "from-teal-500 to-cyan-500",
                },
                {
                  label: "Find by City",
                  to: "/cities",
                  icon: MapPin,
                  color: "from-orange-500 to-red-500",
                },
                {
                  label: "Host an Event",
                  to: "/post-event",
                  icon: Plus,
                  color: "from-indigo-500 to-purple-600",
                },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={i}
                    to={action.to}
                    className="flex items-center gap-4 bg-slate-800/50 border border-slate-700 hover:border-purple-500 rounded-xl p-4 transition group"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon size={18} className="text-white" />
                    </div>
                    <span className="text-white font-semibold group-hover:text-purple-300 transition">
                      {action.label}
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-gray-600 group-hover:text-purple-400 ml-auto transition"
                    />
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6 text-center">
              <p className="text-white font-bold mb-2">Get the WADU App</p>
              <p className="text-gray-400 text-sm mb-4">
                Manage tickets on the go.
              </p>
              <div className="space-y-2">
                <button className="w-full bg-black border border-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-900 transition">
                  App Store
                </button>
                <button className="w-full bg-black border border-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-900 transition">
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
