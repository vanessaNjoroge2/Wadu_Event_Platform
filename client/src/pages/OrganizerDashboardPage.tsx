import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  PlusCircle,
  Users,
  BarChart2,
  Wallet,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  TrendingUp,
  TrendingDown,
  Ticket,
  Star,
  Bell,
  ChevronDown,
  MoreHorizontal,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  LogOut,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const revenueData = [
  { month: "Mar", revenue: 980000 },
  { month: "Apr", revenue: 1250000 },
  { month: "May", revenue: 1100000 },
  { month: "Jun", revenue: 1680000 },
  { month: "Jul", revenue: 2020000 },
  { month: "Aug", revenue: 2450000 },
];

const ticketCategories = [
  { name: "Concerts", value: 480, color: "#6C4DFF" },
  { name: "Tech Events", value: 310, color: "#00C2A8" },
  { name: "Festivals", value: 287, color: "#F59E0B" },
  { name: "Networking", value: 170, color: "#EC4899" },
];

const activeEvents = [
  {
    name: "AfroFest Nairobi 2025",
    date: "Dec 1, 2025",
    sold: 842,
    capacity: 1000,
    revenue: "KES 1,263,000",
    status: "On Sale",
  },
  {
    name: "East Africa Tech Summit",
    date: "Oct 20, 2025",
    sold: 289,
    capacity: 400,
    revenue: "KES 867,000",
    status: "On Sale",
  },
  {
    name: "Lagos Beats Festival",
    date: "Nov 15, 2025",
    sold: 116,
    capacity: 600,
    revenue: "KES 320,000",
    status: "Draft",
  },
];

const transactions = [
  {
    name: "Amara Nwosu",
    event: "AfroFest Nairobi 2025",
    amount: "KES 4,500",
    time: "2 min ago",
    status: "completed",
    avatar: "AN",
    color: "#6C4DFF",
  },
  {
    name: "David Kimani",
    event: "EA Tech Summit",
    amount: "KES 3,000",
    time: "14 min ago",
    status: "completed",
    avatar: "DK",
    color: "#00C2A8",
  },
  {
    name: "Fatima Al-Hassan",
    event: "AfroFest Nairobi 2025",
    amount: "KES 9,000",
    time: "1 hr ago",
    status: "completed",
    avatar: "FA",
    color: "#F59E0B",
  },
  {
    name: "Kofi Mensah",
    event: "Lagos Beats Festival",
    amount: "KES 2,750",
    time: "3 hr ago",
    status: "pending",
    avatar: "KM",
    color: "#EC4899",
  },
  {
    name: "Zanele Dlamini",
    event: "AfroFest Nairobi 2025",
    amount: "KES 4,500",
    time: "5 hr ago",
    status: "completed",
    avatar: "ZD",
    color: "#3B82F6",
  },
];

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/organizer-dashboard", active: true },
  { icon: CalendarDays, label: "My Events", path: "/organizer-dashboard/events", active: false },
  { icon: PlusCircle, label: "Create Event", path: "/post-event", active: false },
  { icon: Users, label: "Attendees", path: "/organizer-dashboard/attendees", active: false },
  { icon: BarChart2, label: "Analytics", path: "/organizer-dashboard/analytics", active: false },
  { icon: Wallet, label: "Payouts", path: "/organizer-dashboard/payouts", active: false },
  { icon: Settings, label: "Settings", path: "/organizer-dashboard/settings", active: false },
  { icon: HelpCircle, label: "Help", path: "/help", active: false },
];

function formatKES(val: number) {
  if (val >= 1000000) return `KES ${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `KES ${(val / 1000).toFixed(0)}K`;
  return `KES ${val}`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0A1F44] border border-[#6C4DFF]/30 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        <p className="text-white font-bold text-sm">{formatKES(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function OrganizerDashboardPage() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate("/sign-in");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* ── SIDEBAR ── */}
      <aside className="w-[240px] min-w-[240px] bg-[#0A1F44] flex flex-col h-full shadow-2xl z-10">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-white tracking-tight">WADU</span>
            <span className="text-xs bg-[#6C4DFF] text-white px-2 py-0.5 rounded-full font-semibold">Pro</span>
          </Link>
        </div>

        {/* Profile */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C4DFF] to-[#00C2A8] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              AF
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">AfroFest Ltd</p>
              <div className="flex items-center gap-1 mt-0.5">
                <CheckCircle2 size={11} className="text-[#00C2A8]" />
                <span className="text-[#00C2A8] text-xs font-medium">Verified Organizer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                item.active
                  ? "bg-[#6C4DFF] text-white shadow-lg shadow-[#6C4DFF]/30"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon size={18} className={item.active ? "text-white" : "text-gray-400 group-hover:text-white"} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition text-sm font-medium"
          >
            <span className="flex items-center gap-3">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
            <div className={`w-9 h-5 rounded-full transition-colors relative ${darkMode ? "bg-[#6C4DFF]" : "bg-white/20"}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${darkMode ? "left-4" : "left-0.5"}`} />
            </div>
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition text-sm font-medium"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">Wednesday, 20 Aug 2025</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-gray-100 transition">
              <Bell size={20} className="text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#6C4DFF] rounded-full" />
            </button>
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition bg-gray-100 px-3 py-2 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6C4DFF] to-[#00C2A8] flex items-center justify-center text-white text-xs font-bold">AF</div>
              AfroFest Ltd
              <ChevronDown size={14} />
            </button>
            <Link
              to="/post-event"
              className="flex items-center gap-2 bg-[#6C4DFF] hover:bg-[#5a3de8] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-md shadow-[#6C4DFF]/30"
            >
              <PlusCircle size={16} />
              Create Event
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* ── STATS ROW ── */}
          <div className="grid grid-cols-4 gap-5">
            {[
              {
                label: "Total Revenue",
                value: "KES 2,450,000",
                change: "+18%",
                sub: "vs last month",
                up: true,
                icon: Wallet,
                iconBg: "bg-emerald-50",
                iconColor: "text-emerald-600",
                changeColor: "text-emerald-600 bg-emerald-50",
              },
              {
                label: "Tickets Sold",
                value: "1,247",
                change: "+24%",
                sub: "vs last month",
                up: true,
                icon: Ticket,
                iconBg: "bg-blue-50",
                iconColor: "text-blue-600",
                changeColor: "text-blue-600 bg-blue-50",
              },
              {
                label: "Active Events",
                value: "3",
                change: "2 ending soon",
                sub: "",
                up: null,
                icon: Star,
                iconBg: "bg-teal-50",
                iconColor: "text-[#00C2A8]",
                changeColor: "text-[#00C2A8] bg-teal-50",
              },
              {
                label: "Upcoming Events",
                value: "7",
                change: "Next in 3 days",
                sub: "",
                up: null,
                icon: CalendarDays,
                iconBg: "bg-purple-50",
                iconColor: "text-[#6C4DFF]",
                changeColor: "text-[#6C4DFF] bg-purple-50",
              },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm font-medium">{stat.label}</span>
                  <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                    <stat.icon size={20} className={stat.iconColor} />
                  </div>
                </div>
                <div className="text-3xl font-black text-gray-900">{stat.value}</div>
                <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${stat.changeColor}`}>
                  {stat.up === true && <TrendingUp size={12} />}
                  {stat.up === false && <TrendingDown size={12} />}
                  {stat.change}
                  {stat.sub && <span className="font-normal text-gray-400">{stat.sub}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* ── CHARTS ROW ── */}
          <div className="grid grid-cols-5 gap-5">
            {/* Line chart */}
            <div className="col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-gray-900">Monthly Revenue</h2>
                  <p className="text-gray-400 text-sm">Last 6 months</p>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-600 font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <TrendingUp size={12} /> +18% this month
                </span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueData} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C4DFF" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6C4DFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#6C4DFF" strokeWidth={2.5} fill="url(#revenueGradient)" dot={{ fill: "#6C4DFF", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#6C4DFF", strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Donut chart */}
            <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="mb-4">
                <h2 className="font-bold text-gray-900">Tickets by Category</h2>
                <p className="text-gray-400 text-sm">All events combined</p>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={ticketCategories} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {ticketCategories.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`${val} tickets`, ""]} contentStyle={{ background: "#0A1F44", border: "1px solid rgba(108,77,255,0.3)", borderRadius: 12, color: "white", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {ticketCategories.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                      <span className="text-gray-600">{cat.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{cat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── BOTTOM ROW ── */}
          <div className="grid grid-cols-5 gap-5 pb-4">
            {/* Events Table */}
            <div className="col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">My Active Events</h2>
                <Link to="#" className="text-[#6C4DFF] text-sm font-semibold hover:text-[#5a3de8] flex items-center gap-1">
                  View all <ExternalLink size={14} />
                </Link>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3 text-left font-semibold">Event Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Tickets</th>
                    <th className="px-4 py-3 text-left font-semibold">Revenue</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {activeEvents.map((event, i) => (
                    <tr key={event.name} className={`border-t border-gray-50 hover:bg-gray-50 transition-colors ${i % 2 === 1 ? "bg-gray-50/50" : "bg-white"}`}>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 truncate max-w-[160px]">{event.name}</p>
                      </td>
                      <td className="px-4 py-4 text-gray-500 whitespace-nowrap">{event.date}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-gray-900 font-medium">{event.sold} / {event.capacity}</span>
                          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#6C4DFF]"
                              style={{ width: `${(event.sold / event.capacity) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-900 whitespace-nowrap">{event.revenue}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          event.status === "On Sale"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Transactions */}
            <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Recent Transactions</h2>
                <Link to="#" className="text-[#6C4DFF] text-sm font-semibold hover:text-[#5a3de8]">View all</Link>
              </div>
              <div className="divide-y divide-gray-50">
                {transactions.map((tx) => (
                  <div key={tx.name + tx.time} className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 transition-colors">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: tx.color }}
                    >
                      {tx.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{tx.name}</p>
                      <p className="text-xs text-gray-400 truncate">{tx.event}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-900">{tx.amount}</p>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        {tx.status === "completed" ? (
                          <CheckCircle2 size={11} className="text-emerald-500" />
                        ) : (
                          <Clock size={11} className="text-amber-500" />
                        )}
                        <span className="text-xs text-gray-400">{tx.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
