import { useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  Search,
  Filter,
  Check,
  Smartphone,
  Building,
  Save,
  User,
  Lock,
  Shield,
  ArrowUpRight
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

// ── MOCK DATA ──
const revenueData = [
  { month: "Mar", revenue: 980000 },
  { month: "Apr", revenue: 1250000 },
  { month: "May", revenue: 1100000 },
  { month: "Jun", revenue: 1680000 },
  { month: "Jul", revenue: 2020000 },
  { month: "Aug", revenue: 2450000 },
];

const dailySalesData = [
  { day: "Mon", sales: 45000 },
  { day: "Tue", sales: 78000 },
  { day: "Wed", sales: 62000 },
  { day: "Thu", sales: 95000 },
  { day: "Fri", sales: 120000 },
  { day: "Sat", sales: 185000 },
  { day: "Sun", sales: 140000 },
];

const ticketCategories = [
  { name: "Concerts", value: 480, color: "#6C4DFF" },
  { name: "Tech Events", value: 310, color: "#00C2A8" },
  { name: "Festivals", value: 287, color: "#F59E0B" },
  { name: "Networking", value: 170, color: "#EC4899" },
];

const deviceData = [
  { name: "Desktop", value: 55, color: "#6C4DFF" },
  { name: "Mobile", value: 38, color: "#00C2A8" },
  { name: "Tablet", value: 7, color: "#F59E0B" },
];

const initialTransactions = [
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
  { icon: LayoutDashboard, label: "Dashboard", path: "/organizer-dashboard" },
  { icon: CalendarDays, label: "My Events", path: "/organizer-dashboard/events" },
  { icon: PlusCircle, label: "Create Event", path: "/post-event" },
  { icon: Users, label: "Attendees", path: "/organizer-dashboard/attendees" },
  { icon: BarChart2, label: "Analytics", path: "/organizer-dashboard/analytics" },
  { icon: Wallet, label: "Payouts", path: "/organizer-dashboard/payouts" },
  { icon: Settings, label: "Settings", path: "/organizer-dashboard/settings" },
  { icon: HelpCircle, label: "Help", path: "/help" },
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
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Sign out handler
  const handleSignOut = () => {
    navigate("/sign-in");
  };

  // State for interactive features
  // Events tab state
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "AfroFest Nairobi 2025",
      date: "Dec 1, 2025",
      sold: 842,
      capacity: 1000,
      revenue: 1263000,
      status: "On Sale",
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      name: "East Africa Tech Summit",
      date: "Oct 20, 2025",
      sold: 289,
      capacity: 400,
      revenue: 867000,
      status: "On Sale",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      name: "Lagos Beats Festival",
      date: "Nov 15, 2025",
      sold: 116,
      capacity: 600,
      revenue: 320000,
      status: "Draft",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 4,
      name: "Mombasa Seafood & Jazz Festival",
      date: "Jan 10, 2026",
      sold: 0,
      capacity: 500,
      revenue: 0,
      status: "Draft",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 5,
      name: "Sauti Sol Tribute Concert",
      date: "Sep 5, 2025",
      sold: 1500,
      capacity: 1500,
      revenue: 3750000,
      status: "Sold Out",
      image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=60"
    },
  ]);
  const [eventSearch, setEventSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("All");

  // Attendees tab state
  const [attendees, setAttendees] = useState([
    { id: "TX-90182", name: "Amara Nwosu", email: "amara@example.com", event: "AfroFest Nairobi 2025", ticket: "VIP", paid: "KES 4,500", date: "Aug 20, 2025", status: "Checked In" },
    { id: "TX-90183", name: "David Kimani", email: "david.k@example.com", event: "East Africa Tech Summit", ticket: "Regular", paid: "KES 3,000", date: "Aug 20, 2025", status: "Confirmed" },
    { id: "TX-90184", name: "Fatima Al-Hassan", email: "fatima@example.com", event: "AfroFest Nairobi 2025", ticket: "VVIP", paid: "KES 9,000", date: "Aug 20, 2025", status: "Checked In" },
    { id: "TX-90185", name: "Kofi Mensah", email: "kofi@example.com", event: "Lagos Beats Festival", ticket: "Regular", paid: "KES 2,750", date: "Aug 19, 2025", status: "Pending" },
    { id: "TX-90186", name: "Zanele Dlamini", email: "zanele@example.com", event: "AfroFest Nairobi 2025", ticket: "VIP", paid: "KES 4,500", date: "Aug 19, 2025", status: "Checked In" },
    { id: "TX-90187", name: "Michael Mwangi", email: "mwangi.m@example.com", event: "Sauti Sol Tribute Concert", ticket: "Regular", paid: "KES 2,500", date: "Aug 18, 2025", status: "Confirmed" },
    { id: "TX-90188", name: "Elena Rostova", email: "elena.r@example.com", event: "East Africa Tech Summit", ticket: "Speaker", paid: "KES 0", date: "Aug 18, 2025", status: "Checked In" },
  ]);
  const [attendeeSearch, setAttendeeSearch] = useState("");
  const [selectedEventFilter, setSelectedEventFilter] = useState("All");

  // Payouts state
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [payoutStatus, setPayoutStatus] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("mpesa"); // "mpesa" | "bank"
  const [balance, setBalance] = useState(482500);
  const [mpesaName, setMpesaName] = useState("AfroFest Ltd");
  const [mpesaPhone, setMpesaPhone] = useState("0712345678");
  const [bankName, setBankName] = useState("NCBA Bank Kenya");
  const [bankAccountName, setBankAccountName] = useState("AfroFest Limited");
  const [bankAccountNumber, setBankAccountNumber] = useState("1029384756");
  const [bankSwift, setBankSwift] = useState("NCBAKENA");
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);
  const [payoutsHistory, setPayoutsHistory] = useState([
    { date: "Aug 15, 2025", id: "PAY-89210-KE", amount: "KES 450,000", method: "M-Pesa (+254 712 *** 678)", status: "Completed" },
    { date: "Jul 30, 2025", id: "PAY-82190-KE", amount: "KES 600,000", method: "NCBA Bank Transfer", status: "Completed" },
    { date: "Jul 15, 2025", id: "PAY-78201-KE", amount: "KES 917,500", method: "M-Pesa (+254 712 *** 678)", status: "Completed" },
  ]);

  // Settings state
  const [orgName, setOrgName] = useState("AfroFest Ltd");
  const [orgEmail, setOrgEmail] = useState("billing@afrofest.co");
  const [orgWebsite, setOrgWebsite] = useState("https://afrofest.co");
  const [orgBio, setOrgBio] = useState("Bringing the best of African arts, music, and food to the world.");
  const [emailOnTicketSale, setEmailOnTicketSale] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Check In quick action
  const handleCheckIn = (id: string) => {
    setAttendees(prev =>
      prev.map(a => (a.id === id ? { ...a, status: "Checked In" } : a))
    );
  };

  // Instant Payout handler
  const handleRequestPayout = () => {
    if (balance <= 0) return;
    setRequestingPayout(true);
    setPayoutStatus("Verifying balance...");
    
    setTimeout(() => {
      setPayoutStatus("Initiating secure transfer...");
      setTimeout(() => {
        setPayoutsHistory(prev => [
          {
            date: "Today",
            id: `PAY-${Math.floor(10000 + Math.random() * 90000)}-KE`,
            amount: `KES ${balance.toLocaleString()}`,
            method: payoutMethod === "mpesa" ? `M-Pesa (${mpesaPhone.substring(0, 4)} *** ${mpesaPhone.substring(7)})` : `${bankName} Transfer`,
            status: "Completed"
          },
          ...prev
        ]);
        setBalance(0);
        setRequestingPayout(false);
        setPayoutStatus("Completed!");
      }, 1500);
    }, 1200);
  };

  // Save Payout Settings handler
  const handleSavePayoutSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 3000);
  };

  // Save Settings handler
  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Navigation title calculation
  const getPageTitle = () => {
    if (currentPath === "/organizer-dashboard/events") return "My Events";
    if (currentPath === "/organizer-dashboard/attendees") return "Attendees";
    if (currentPath === "/organizer-dashboard/analytics") return "Analytics";
    if (currentPath === "/organizer-dashboard/payouts") return "Payouts";
    if (currentPath === "/organizer-dashboard/settings") return "Settings";
    return "Dashboard";
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = e.name.toLowerCase().includes(eventSearch.toLowerCase());
      const matchesFilter = eventFilter === "All" || e.status === eventFilter;
      return matchesSearch && matchesFilter;
    });
  }, [events, eventSearch, eventFilter]);

  // Filtered Attendees
  const filteredAttendees = useMemo(() => {
    return attendees.filter(a => {
      const matchesSearch =
        a.name.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
        a.email.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
        a.id.toLowerCase().includes(attendeeSearch.toLowerCase());
      const matchesEvent = selectedEventFilter === "All" || a.event === selectedEventFilter;
      return matchesSearch && matchesEvent;
    });
  }, [attendees, attendeeSearch, selectedEventFilter]);

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-200 ${darkMode ? "dark bg-slate-950 text-slate-100" : "bg-gray-50 text-gray-800"}`}>
      
      {/* ── SIDEBAR ── */}
      <aside className="w-[240px] min-w-[240px] bg-[#0A1F44] flex flex-col h-full shadow-2xl z-10 text-white">
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
              <p className="text-white font-semibold text-sm truncate">{orgName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <CheckCircle2 size={11} className="text-[#00C2A8]" />
                <span className="text-[#00C2A8] text-xs font-medium">Verified Organizer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.path === "/organizer-dashboard"
              ? currentPath === "/organizer-dashboard" || currentPath === "/organizer-dashboard/"
              : currentPath === item.path;
            
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-[#6C4DFF] text-white shadow-lg shadow-[#6C4DFF]/30"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-white" : "text-gray-400 group-hover:text-white"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
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
        
        {/* Top Header */}
        <header className={`border-b px-8 py-4 flex items-center justify-between flex-shrink-0 transition-colors duration-200 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"}`}>
          <div>
            <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
            <p className="text-gray-400 text-sm mt-0.5">Thursday, 21 May 2026</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className={`relative p-2 rounded-xl transition ${darkMode ? "hover:bg-slate-800 text-slate-300" : "hover:bg-gray-100 text-gray-500"}`}>
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#6C4DFF] rounded-full" />
            </button>
            
            <button className={`flex items-center gap-2 text-sm font-medium transition px-3 py-2 rounded-xl ${darkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-200" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6C4DFF] to-[#00C2A8] flex items-center justify-center text-white text-xs font-bold">AF</div>
              {orgName}
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

        {/* Dynamic Views Rendering Area */}
        <div className={`flex-1 overflow-y-auto px-8 py-6 space-y-6 transition-colors duration-200 ${darkMode ? "bg-slate-950" : "bg-gray-50"}`}>
          
          {/* 1️⃣ VIEW: DASHBOARD OVERVIEW (default) */}
          {(currentPath === "/organizer-dashboard" || currentPath === "/organizer-dashboard/") && (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {[
                  {
                    label: "Total Revenue",
                    value: `KES ${(2450000 + (482500 - balance)).toLocaleString()}`,
                    change: "+18%",
                    sub: "vs last month",
                    up: true,
                    icon: Wallet,
                    iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
                    iconColor: "text-emerald-600 dark:text-emerald-400",
                    changeColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400",
                  },
                  {
                    label: "Tickets Sold",
                    value: "1,247",
                    change: "+24%",
                    sub: "vs last month",
                    up: true,
                    icon: Ticket,
                    iconBg: "bg-blue-50 dark:bg-blue-950/30",
                    iconColor: "text-blue-600 dark:text-blue-400",
                    changeColor: "text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400",
                  },
                  {
                    label: "Active Events",
                    value: `${events.filter(e => e.status === "On Sale").length}`,
                    change: "2 ending soon",
                    sub: "",
                    up: null,
                    icon: Star,
                    iconBg: "bg-teal-50 dark:bg-teal-950/30",
                    iconColor: "text-[#00C2A8]",
                    changeColor: "text-[#00C2A8] bg-teal-50 dark:bg-teal-950/20",
                  },
                  {
                    label: "Upcoming Events",
                    value: `${events.filter(e => e.status === "Draft" || e.status === "On Sale").length}`,
                    change: "Next in 3 days",
                    sub: "",
                    up: null,
                    icon: CalendarDays,
                    iconBg: "bg-purple-50 dark:bg-purple-950/30",
                    iconColor: "text-[#6C4DFF]",
                    changeColor: "text-[#6C4DFF] bg-purple-50 dark:bg-purple-950/20",
                  },
                ].map((stat) => (
                  <div key={stat.label} className={`rounded-2xl p-5 flex flex-col gap-3 shadow-sm border transition hover:shadow-md ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-gray-500"}`}>{stat.label}</span>
                      <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                        <stat.icon size={20} className={stat.iconColor} />
                      </div>
                    </div>
                    <div className="text-3xl font-black">{stat.value}</div>
                    <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${stat.changeColor}`}>
                      {stat.up === true && <TrendingUp size={12} />}
                      {stat.up === false && <TrendingDown size={12} />}
                      {stat.change}
                      {stat.sub && <span className="font-normal opacity-70 ml-1">{stat.sub}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Line chart */}
                <div className={`lg:col-span-3 rounded-2xl shadow-sm border p-6 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-bold">Monthly Revenue</h2>
                      <p className="text-gray-400 text-sm">Last 6 months</p>
                    </div>
                    <span className="text-xs bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
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
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#f0f0f0"} vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" stroke="#6C4DFF" strokeWidth={2.5} fill="url(#revenueGradient)" dot={{ fill: "#6C4DFF", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#6C4DFF", strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Donut chart */}
                <div className={`lg:col-span-2 rounded-2xl shadow-sm border p-6 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div className="mb-4">
                    <h2 className="font-bold">Tickets by Category</h2>
                    <p className="text-gray-400 text-sm">All events combined</p>
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={ticketCategories} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                        {ticketCategories.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(val) => [`${val} tickets`, ""]} contentStyle={{ background: "#0A1F44", border: "1px solid rgba(108,77,255,0.3)", borderRadius: 12, color: "white", fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {ticketCategories.map((cat) => (
                      <div key={cat.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                          <span className={`${darkMode ? "text-slate-300" : "text-gray-600"}`}>{cat.name}</span>
                        </div>
                        <span className="font-semibold">{cat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Active Events & Transactions */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 pb-4">
                {/* Events list mini */}
                <div className={`lg:col-span-3 rounded-2xl shadow-sm border overflow-hidden ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
                    <h2 className="font-bold">My Active Events</h2>
                    <Link to="/organizer-dashboard/events" className="text-[#6C4DFF] text-sm font-semibold hover:text-[#5a3de8] flex items-center gap-1">
                      View all <ExternalLink size={14} />
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className={`text-xs uppercase tracking-wider ${darkMode ? "bg-slate-800/50 text-slate-400" : "bg-gray-50 text-gray-500"}`}>
                          <th className="px-6 py-3 font-semibold">Event Name</th>
                          <th className="px-4 py-3 font-semibold">Date</th>
                          <th className="px-4 py-3 font-semibold">Tickets</th>
                          <th className="px-4 py-3 font-semibold">Revenue</th>
                          <th className="px-4 py-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.slice(0, 3).map((event, i) => (
                          <tr key={event.name} className={`border-t transition-colors ${darkMode ? "border-slate-800 hover:bg-slate-800/30" : "border-gray-50 hover:bg-gray-50"} ${i % 2 === 1 ? (darkMode ? "bg-slate-900" : "bg-gray-50/50") : ""}`}>
                            <td className="px-6 py-4 font-semibold">{event.name}</td>
                            <td className="px-4 py-4 text-gray-400 whitespace-nowrap">{event.date}</td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-1">
                                <span className="font-medium">{event.sold} / {event.capacity}</span>
                                <div className="w-20 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-[#6C4DFF]"
                                    style={{ width: `${(event.sold / event.capacity) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 font-semibold">KES {event.revenue.toLocaleString()}</td>
                            <td className="px-4 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                event.status === "On Sale"
                                  ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                                  : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                              }`}>
                                {event.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Transactions list mini */}
                <div className={`lg:col-span-2 rounded-2xl shadow-sm border overflow-hidden ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
                    <h2 className="font-bold">Recent Transactions</h2>
                    <Link to="/organizer-dashboard/attendees" className="text-[#6C4DFF] text-sm font-semibold hover:text-[#5a3de8]">View all</Link>
                  </div>
                  <div className="divide-y divide-gray-50 dark:divide-slate-800">
                    {initialTransactions.map((tx) => (
                      <div key={tx.name + tx.time} className={`flex items-center gap-3 px-6 py-3.5 transition-colors ${darkMode ? "hover:bg-slate-800/30" : "hover:bg-gray-50"}`}>
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: tx.color }}
                        >
                          {tx.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{tx.name}</p>
                          <p className="text-xs text-gray-400 truncate">{tx.event}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold">{tx.amount}</p>
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
            </>
          )}

          {/* 2️⃣ VIEW: MY EVENTS */}
          {currentPath === "/organizer-dashboard/events" && (
            <div className="space-y-6">
              {/* Filter controls */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className={`flex items-center gap-3 border rounded-xl px-3 py-2 w-full md:w-96 transition-colors ${darkMode ? "bg-slate-900 border-slate-800 focus-within:border-[#6C4DFF]" : "bg-white border-gray-200 focus-within:border-[#6C4DFF]"}`}>
                  <Search size={18} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by event name..."
                    className="bg-transparent border-none outline-none text-sm w-full focus:ring-0 placeholder:text-gray-400"
                    value={eventSearch}
                    onChange={(e) => setEventSearch(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                  {["All", "On Sale", "Draft", "Sold Out"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setEventFilter(filter)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                        eventFilter === filter
                          ? "bg-[#6C4DFF] text-white shadow-md shadow-[#6C4DFF]/25"
                          : darkMode
                          ? "bg-slate-900 hover:bg-slate-800 text-slate-300"
                          : "bg-white hover:bg-gray-100 text-gray-600 border border-gray-100"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Events list */}
              <div className="grid grid-cols-1 gap-4">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((e) => (
                    <div
                      key={e.id}
                      className={`rounded-2xl p-5 border shadow-sm flex flex-col md:flex-row items-center gap-5 transition hover:shadow-md ${
                        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"
                      }`}
                    >
                      {/* Image */}
                      <div className="w-full md:w-36 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800 relative">
                        <img
                          src={e.image}
                          alt={e.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase ${
                          e.status === "On Sale"
                            ? "bg-emerald-500 text-white"
                            : e.status === "Sold Out"
                            ? "bg-blue-600 text-white"
                            : "bg-amber-500 text-slate-900"
                        }`}>
                          {e.status}
                        </span>
                      </div>

                      {/* Event Detail */}
                      <div className="flex-1 min-w-0 w-full">
                        <h3 className="text-lg font-bold truncate">{e.name}</h3>
                        <p className="text-gray-400 text-xs mt-1 flex items-center gap-1.5">
                          <CalendarDays size={13} />
                          {e.date} • Nairobi, Kenya
                        </p>

                        {/* Progress */}
                        {e.status !== "Draft" ? (
                          <div className="mt-3 space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className="text-gray-400">Tickets Registered</span>
                              <span>{e.sold} / {e.capacity} ({Math.round((e.sold / e.capacity) * 100)}%)</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#6C4DFF] to-[#00C2A8]"
                                style={{ width: `${(e.sold / e.capacity) * 100}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="text-[#EC4899] text-xs font-semibold mt-3">Event is in draft mode. Submit for approval to publish.</p>
                        )}
                      </div>

                      {/* Financial / Revenue */}
                      <div className="text-left md:text-right w-full md:w-44 flex-shrink-0 border-t md:border-t-0 md:border-l border-gray-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-5">
                        <p className="text-gray-400 text-xs font-medium">Estimated Revenue</p>
                        <p className="text-xl font-black mt-1">KES {e.revenue.toLocaleString()}</p>
                        <p className="text-gray-400 text-[10px] mt-0.5">VAT & Fees inclusive</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                        <button className={`p-2.5 rounded-xl border transition ${
                          darkMode ? "border-slate-800 hover:bg-slate-800" : "border-gray-200 hover:bg-gray-50"
                        }`}>
                          <Settings size={16} />
                        </button>
                        <button className="flex-1 md:flex-none bg-[#6C4DFF] hover:bg-[#5a3de8] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition">
                          Manage
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <CalendarDays size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold">No Events Found</h3>
                    <p className="text-gray-400 text-sm max-w-sm mx-auto mt-1">We couldn't find any events matching "{eventSearch}" under this filter.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3️⃣ VIEW: ATTENDEES */}
          {currentPath === "/organizer-dashboard/attendees" && (
            <div className="space-y-6">
              
              {/* Quick Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { label: "Total Registered", value: "1,247", desc: "Across all active events", color: "text-[#6C4DFF]" },
                  { label: "Checked In", value: `${attendees.filter(a => a.status === "Checked In").length} / ${attendees.length}`, desc: "Attending live sessions", color: "text-emerald-500" },
                  { label: "Check-in rate", value: `${Math.round((attendees.filter(a => a.status === "Checked In").length / attendees.length) * 100)}%`, desc: "Average QR scans", color: "text-[#00C2A8]" },
                ].map(m => (
                  <div key={m.label} className={`p-5 rounded-2xl border shadow-sm flex flex-col gap-1 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                    <span className="text-gray-400 text-xs font-semibold uppercase">{m.label}</span>
                    <span className={`text-3xl font-black ${m.color}`}>{m.value}</span>
                    <span className="text-gray-400 text-xs mt-1">{m.desc}</span>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className={`flex items-center gap-3 border rounded-xl px-3 py-2 w-full md:w-96 transition-colors ${darkMode ? "bg-slate-900 border-slate-800 focus-within:border-[#6C4DFF]" : "bg-white border-gray-200 focus-within:border-[#6C4DFF]"}`}>
                  <Search size={18} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email or ticket ID..."
                    className="bg-transparent border-none outline-none text-sm w-full focus:ring-0 placeholder:text-gray-400"
                    value={attendeeSearch}
                    onChange={(e) => setAttendeeSearch(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <span className="text-gray-400 text-xs font-semibold whitespace-nowrap">Filter by Event:</span>
                  <select
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border outline-none cursor-pointer w-full md:w-60 transition ${
                      darkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-gray-200 text-gray-700"
                    }`}
                    value={selectedEventFilter}
                    onChange={(e) => setSelectedEventFilter(e.target.value)}
                  >
                    <option value="All">All Events</option>
                    <option value="AfroFest Nairobi 2025">AfroFest Nairobi 2025</option>
                    <option value="East Africa Tech Summit">East Africa Tech Summit</option>
                    <option value="Lagos Beats Festival">Lagos Beats Festival</option>
                    <option value="Sauti Sol Tribute Concert">Sauti Sol Tribute Concert</option>
                  </select>
                </div>
              </div>

              {/* Attendees Table */}
              <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className={`text-xs uppercase tracking-wider ${darkMode ? "bg-slate-800/50 text-slate-400" : "bg-gray-50 text-gray-500"}`}>
                        <th className="px-6 py-4 font-semibold">Ticket ID</th>
                        <th className="px-4 py-4 font-semibold">Attendee</th>
                        <th className="px-4 py-4 font-semibold">Event</th>
                        <th className="px-4 py-4 font-semibold">Ticket Type</th>
                        <th className="px-4 py-4 font-semibold">Amount Paid</th>
                        <th className="px-4 py-4 font-semibold">Date Registered</th>
                        <th className="px-4 py-4 font-semibold">Check-In Status</th>
                        <th className="px-4 py-4 font-semibold"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {filteredAttendees.length > 0 ? (
                        filteredAttendees.map((a) => (
                          <tr key={a.id} className={`transition-colors ${darkMode ? "hover:bg-slate-800/30" : "hover:bg-gray-50"}`}>
                            <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-400">{a.id}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C4DFF]/20 to-[#00C2A8]/20 flex items-center justify-center text-xs font-bold text-[#6C4DFF] flex-shrink-0">
                                  {a.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold truncate">{a.name}</p>
                                  <p className="text-gray-400 text-xs truncate mt-0.5">{a.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 font-medium max-w-[150px] truncate">{a.event}</td>
                            <td className="px-4 py-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide ${
                                a.ticket === "VIP" || a.ticket === "VVIP"
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400"
                                  : a.ticket === "Speaker"
                                  ? "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400"
                                  : "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400"
                              }`}>
                                {a.ticket}
                              </span>
                            </td>
                            <td className="px-4 py-4 font-semibold">{a.paid}</td>
                            <td className="px-4 py-4 text-gray-400">{a.date}</td>
                            <td className="px-4 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                                a.status === "Checked In"
                                  ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                                  : a.status === "Confirmed"
                                  ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
                                  : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                              }`}>
                                {a.status === "Checked In" ? (
                                  <Check size={12} className="text-emerald-500" />
                                ) : a.status === "Confirmed" ? (
                                  <CheckCircle2 size={12} className="text-blue-500" />
                                ) : (
                                  <Clock size={12} className="text-amber-500" />
                                )}
                                {a.status}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              {a.status !== "Checked In" && (
                                <button
                                  onClick={() => handleCheckIn(a.id)}
                                  className="text-xs bg-[#00C2A8]/10 hover:bg-[#00C2A8]/20 text-[#00C2A8] px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1"
                                >
                                  Check In
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center py-16 text-gray-400">
                            <Users size={48} className="mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-bold text-gray-300">No Attendees Found</h3>
                            <p className="text-sm max-w-sm mx-auto mt-1">Try refining your search keyword or selected event filter.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 4️⃣ VIEW: ANALYTICS */}
          {currentPath === "/organizer-dashboard/analytics" && (
            <div className="space-y-6">
              
              {/* Analytics Header Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {[
                  { label: "Total Page Views", value: "45,820", icon: ExternalLink, color: "text-[#6C4DFF]" },
                  { label: "Tickets Sold", value: "1,247", icon: Ticket, color: "text-blue-500" },
                  { label: "Conversion Rate", value: "2.7%", icon: TrendingUp, color: "text-emerald-500" },
                  { label: "Average Order Value", value: "KES 3,250", icon: Wallet, color: "text-[#00C2A8]" },
                ].map(m => (
                  <div key={m.label} className={`p-5 rounded-2xl border shadow-sm flex items-center justify-between ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                    <div className="space-y-1">
                      <span className="text-gray-400 text-xs font-semibold uppercase">{m.label}</span>
                      <p className="text-2xl font-black">{m.value}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                      <m.icon size={20} className={m.color} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Analytics charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* Daily ticket sales */}
                <div className={`lg:col-span-2 p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-bold">Daily Ticket Revenue</h3>
                      <p className="text-gray-400 text-xs">Sales activity over the past week</p>
                    </div>
                    <span className="text-xs bg-[#00C2A8]/10 text-[#00C2A8] font-bold px-3 py-1.5 rounded-full">
                      Peak: Sat (KES 185K)
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={dailySalesData} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
                      <defs>
                        <linearGradient id="dailySalesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00C2A8" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#00C2A8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#f0f0f0"} vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={(v) => `${v / 1000}K`} tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                      <RechartsTooltip formatter={(val) => [`KES ${val.toLocaleString()}`, "Revenue"]} contentStyle={{ background: "#0A1F44", border: "1px solid rgba(0,194,168,0.3)", borderRadius: 12, color: "white", fontSize: 12 }} />
                      <Area type="monotone" dataKey="sales" stroke="#00C2A8" strokeWidth={2.5} fill="url(#dailySalesGrad)" dot={{ fill: "#00C2A8", r: 4, strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Device type breakdown */}
                <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div className="mb-6">
                    <h3 className="font-bold">Traffic Channels</h3>
                    <p className="text-gray-400 text-xs">Device distribution of checkout page</p>
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={deviceData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                        {deviceData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(val) => [`${val}%`, "Device Ratio"]} contentStyle={{ background: "#0A1F44", border: "none", borderRadius: 12, color: "white", fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3 mt-4">
                    {deviceData.map((d) => (
                      <div key={d.name} className="flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                          <span className="text-gray-400">{d.name}</span>
                        </div>
                        <span>{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Event Performance Comparisons */}
              <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                <div className="mb-6">
                  <h3 className="font-bold">Event Sales Performance</h3>
                  <p className="text-gray-400 text-xs">Revenue generated across your event library</p>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={events.filter(e => e.revenue > 0)} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#f0f0f0"} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(v) => `KES ${(v / 1000000).toFixed(1)}M`} tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip formatter={(val) => [`KES ${Number(val).toLocaleString()}`, "Revenue"]} contentStyle={{ background: "#0A1F44", border: "none", borderRadius: 12, color: "white", fontSize: 12 }} />
                    <Bar dataKey="revenue" fill="#6C4DFF" radius={[8, 8, 0, 0]}>
                      {events.filter(e => e.revenue > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#6C4DFF" : "#00C2A8"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          )}

          {/* 5️⃣ VIEW: PAYOUTS */}
          {currentPath === "/organizer-dashboard/payouts" && (
            <div className="space-y-6">
              
              {/* Wallet balances */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Account Balance Card */}
                <div className="rounded-2xl p-6 bg-gradient-to-br from-[#6C4DFF] to-[#0A1F44] text-white shadow-xl flex flex-col justify-between h-[180px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="space-y-1">
                    <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">Account Balance</span>
                    <p className="text-3xl font-black">KES {balance.toLocaleString()}</p>
                  </div>

                  <div>
                    {balance > 0 ? (
                      <button
                        onClick={handleRequestPayout}
                        disabled={requestingPayout}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                          requestingPayout
                            ? "bg-white/20 text-white/50 cursor-not-allowed"
                            : "bg-[#00C2A8] hover:bg-[#00b098] text-white shadow-md shadow-[#00C2A8]/20"
                        }`}
                      >
                        {requestingPayout ? payoutStatus : (
                          <>
                            Request Instant Payout
                            <ArrowUpRight size={16} />
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="bg-white/10 rounded-xl px-4 py-2.5 text-xs text-white/80 font-bold text-center">
                        Payout completed successfully.
                      </div>
                    )}
                  </div>
                </div>

                {/* Scheduled Payout */}
                <div className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between h-[180px] ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div className="space-y-1">
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Scheduled Payout (Sept 1)</span>
                    <p className="text-3xl font-black">KES 1,263,000</p>
                    <p className="text-gray-400 text-xs mt-1">Automatic payout to NCB Bank Account</p>
                  </div>
                  
                  <div className="flex items-center gap-2 border-t pt-3 border-gray-100 dark:border-slate-800 text-xs text-gray-400">
                    <CheckCircle2 size={14} className="text-[#00C2A8]" />
                    Verification checks completed.
                  </div>
                </div>

                {/* Lifetime earnings */}
                <div className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between h-[180px] ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div className="space-y-1">
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Lifetime Revenue</span>
                    <p className="text-3xl font-black">KES {(2450000 + (482500 - balance)).toLocaleString()}</p>
                    <p className="text-gray-400 text-xs mt-1">Excludes active refund reserves</p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                    <TrendingUp size={14} />
                    +34% Growth compared to Q1 2025
                  </div>
                </div>
              </div>

              {/* Payment Details Form */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Form configuration */}
                <div className={`lg:col-span-2 p-6 rounded-2xl border shadow-sm space-y-5 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div>
                    <h3 className="font-bold text-lg">Payout Accounts Setup</h3>
                    <p className="text-gray-400 text-xs">Configure where you receive ticket sales payouts</p>
                  </div>

                  {/* Payment Method Switcher */}
                  <div className="flex bg-gray-100 dark:bg-slate-800 p-1.5 rounded-xl gap-2 w-fit">
                    <button
                      type="button"
                      onClick={() => setPayoutMethod("mpesa")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                        payoutMethod === "mpesa"
                          ? "bg-[#00C2A8] text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Smartphone size={14} />
                      M-Pesa (Kenya Mobile Money)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayoutMethod("bank")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                        payoutMethod === "bank"
                          ? "bg-[#6C4DFF] text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Building size={14} />
                      Bank Account Transfer
                    </button>
                  </div>

                  {/* Payout Details input forms */}
                  <form onSubmit={handleSavePayoutSettings} className="space-y-4 pt-2">
                    {payoutMethod === "mpesa" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-400">Registered Name (Safaricom M-Pesa)</label>
                          <input
                            type="text"
                            required
                            className={`w-full text-sm px-4 py-3 rounded-xl border outline-none ${
                              darkMode ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-[#00C2A8]" : "bg-white border-gray-200 focus:border-[#00C2A8]"
                            }`}
                            value={mpesaName}
                            onChange={(e) => setMpesaName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-400">Registered Safaricom Mobile Number</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-sm text-gray-400 font-bold">+254</span>
                            <input
                              type="text"
                              required
                              pattern="[0-9]{9,10}"
                              className={`w-full text-sm pl-14 pr-4 py-3 rounded-xl border outline-none ${
                                darkMode ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-[#00C2A8]" : "bg-white border-gray-200 focus:border-[#00C2A8]"
                              }`}
                              placeholder="712345678"
                              value={mpesaPhone}
                              onChange={(e) => setMpesaPhone(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-400">Bank Name</label>
                          <input
                            type="text"
                            required
                            className={`w-full text-sm px-4 py-3 rounded-xl border outline-none ${
                              darkMode ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-[#6C4DFF]" : "bg-white border-gray-200 focus:border-[#6C4DFF]"
                            }`}
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-400">Account Holder Name</label>
                          <input
                            type="text"
                            required
                            className={`w-full text-sm px-4 py-3 rounded-xl border outline-none ${
                              darkMode ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-[#6C4DFF]" : "bg-white border-gray-200 focus:border-[#6C4DFF]"
                            }`}
                            value={bankAccountName}
                            onChange={(e) => setBankAccountName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-400">Account Number</label>
                          <input
                            type="text"
                            required
                            className={`w-full text-sm px-4 py-3 rounded-xl border outline-none ${
                              darkMode ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-[#6C4DFF]" : "bg-white border-gray-200 focus:border-[#6C4DFF]"
                            }`}
                            value={bankAccountNumber}
                            onChange={(e) => setBankAccountNumber(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-400">SWIFT / BIC Code</label>
                          <input
                            type="text"
                            required
                            className={`w-full text-sm px-4 py-3 rounded-xl border outline-none ${
                              darkMode ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-[#6C4DFF]" : "bg-white border-gray-200 focus:border-[#6C4DFF]"
                            }`}
                            value={bankSwift}
                            onChange={(e) => setBankSwift(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex items-center gap-2 bg-[#6C4DFF] hover:bg-[#5a3de8] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition"
                      >
                        <Save size={14} />
                        Save Payout Details
                      </button>

                      {saveSettingsSuccess && (
                        <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
                          <Check size={14} />
                          Saved successfully!
                        </span>
                      )}
                    </div>
                  </form>
                </div>

                {/* Quick Info card */}
                <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <h4 className="font-bold text-sm">Payout Rules & Fees</h4>
                  <ul className="space-y-3 text-xs text-gray-400 font-medium">
                    <li className="flex gap-2">
                      <span className="text-[#00C2A8]">•</span>
                      <span>M-Pesa instant transfers reflect within 2 minutes. Instant payout fee is 1.5%.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00C2A8]">•</span>
                      <span>Regular bank transfers are free of charge and processed automatically every Saturday.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00C2A8]">•</span>
                      <span>Minimum transfer limit is KES 500; maximum per single instant transfer is KES 150,000 due to Central Bank regulation.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Payout History list */}
              <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800">
                  <h3 className="font-bold text-md">Payouts History</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className={`text-xs uppercase tracking-wider ${darkMode ? "bg-slate-800/50 text-slate-400" : "bg-gray-50 text-gray-500"}`}>
                        <th className="px-6 py-4 font-semibold">Date Completed</th>
                        <th className="px-4 py-4 font-semibold">Payout ID</th>
                        <th className="px-4 py-4 font-semibold">Amount Transferred</th>
                        <th className="px-4 py-4 font-semibold">Destination Method</th>
                        <th className="px-4 py-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                      {payoutsHistory.map((history) => (
                        <tr key={history.id} className={`transition-colors ${darkMode ? "hover:bg-slate-800/30" : "hover:bg-gray-50"}`}>
                          <td className="px-6 py-4 text-gray-400">{history.date}</td>
                          <td className="px-4 py-4 font-mono text-xs font-semibold text-gray-400">{history.id}</td>
                          <td className="px-4 py-4 font-black">{history.amount}</td>
                          <td className="px-4 py-4 font-medium text-gray-400">{history.method}</td>
                          <td className="px-4 py-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                              <Check size={12} className="text-emerald-500" />
                              {history.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* 6️⃣ VIEW: SETTINGS */}
          {currentPath === "/organizer-dashboard/settings" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              
              {/* Profile Config */}
              <div className={`lg:col-span-2 p-6 rounded-2xl border shadow-sm space-y-6 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                <div>
                  <h3 className="font-bold text-lg">Organization Profile</h3>
                  <p className="text-gray-400 text-xs">Configure your public facing branding as an organizer</p>
                </div>

                <form onSubmit={handleSaveGeneralSettings} className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-5 items-center pb-4 border-b border-gray-100 dark:border-slate-800">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6C4DFF] to-[#00C2A8] flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                      AF
                    </div>
                    <div className="space-y-1 w-full text-center md:text-left">
                      <p className="text-sm font-semibold">Branding Logo</p>
                      <p className="text-gray-400 text-xs">PNG, JPG up to 2MB. Logo appears on all your public ticket pages.</p>
                      <button type="button" className={`px-4 py-1.5 rounded-lg text-xs font-bold mt-1 border transition ${
                        darkMode ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}>
                        Upload Logo
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-400">Organization Name</label>
                      <input
                        type="text"
                        required
                        className={`w-full text-sm px-4 py-3 rounded-xl border outline-none focus:border-[#6C4DFF] ${
                          darkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-200"
                        }`}
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-400">Contact / Billing Email</label>
                      <input
                        type="email"
                        required
                        className={`w-full text-sm px-4 py-3 rounded-xl border outline-none focus:border-[#6C4DFF] ${
                          darkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-200"
                        }`}
                        value={orgEmail}
                        onChange={(e) => setOrgEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-semibold text-gray-400">Website Address</label>
                      <input
                        type="url"
                        className={`w-full text-sm px-4 py-3 rounded-xl border outline-none focus:border-[#6C4DFF] ${
                          darkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-200"
                        }`}
                        value={orgWebsite}
                        onChange={(e) => setOrgWebsite(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-semibold text-gray-400">Organization Description</label>
                      <textarea
                        rows={3}
                        className={`w-full text-sm px-4 py-3 rounded-xl border outline-none focus:border-[#6C4DFF] resize-none ${
                          darkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-200"
                        }`}
                        value={orgBio}
                        onChange={(e) => setOrgBio(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-[#6C4DFF] hover:bg-[#5a3de8] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition"
                    >
                      <Save size={14} />
                      Save General Profile
                    </button>

                    {settingsSaved && (
                      <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
                        <Check size={14} />
                        Profile updated!
                      </span>
                    )}
                  </div>
                </form>
              </div>

              {/* Notifications and Security panel */}
              <div className="space-y-5">
                {/* Security settings */}
                <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-slate-800">
                    <Shield size={16} className="text-[#6C4DFF]" />
                    <h4 className="font-bold text-sm">Security Controls</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-gray-400 uppercase">Change Account Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none focus:border-[#6C4DFF] ${
                          darkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-gray-200"
                        }`}
                      />
                    </div>
                    <button className="w-full text-xs bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 hover:bg-gray-200 font-bold py-2.5 rounded-lg transition">
                      Reset Password
                    </button>
                  </div>
                </div>

                {/* Notifications setup */}
                <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-slate-800">
                    <Bell size={16} className="text-[#00C2A8]" />
                    <h4 className="font-bold text-sm">Sale Notifications</h4>
                  </div>

                  <div className="space-y-4">
                    {/* Toggle row 1 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold">Email on Ticket Sale</p>
                        <p className="text-[10px] text-gray-400">Receive alert for every registration</p>
                      </div>
                      <button
                        onClick={() => setEmailOnTicketSale(!emailOnTicketSale)}
                        className={`w-9 h-5 rounded-full transition relative ${emailOnTicketSale ? "bg-[#00C2A8]" : "bg-gray-200 dark:bg-slate-700"}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${emailOnTicketSale ? "left-4.5" : "left-0.5"}`} />
                      </button>
                    </div>

                    {/* Toggle row 2 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold">Daily Digest Digest</p>
                        <p className="text-[10px] text-gray-400">Summarized transaction email daily</p>
                      </div>
                      <button
                        onClick={() => setDailyDigest(!dailyDigest)}
                        className={`w-9 h-5 rounded-full transition relative ${dailyDigest ? "bg-[#00C2A8]" : "bg-gray-200 dark:bg-slate-700"}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${dailyDigest ? "left-4.5" : "left-0.5"}`} />
                      </button>
                    </div>

                    {/* Toggle row 3 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold">Weekly Performance Report</p>
                        <p className="text-[10px] text-gray-400">Full analysis report on Monday mornings</p>
                      </div>
                      <button
                        onClick={() => setWeeklyDigest(!weeklyDigest)}
                        className={`w-9 h-5 rounded-full transition relative ${weeklyDigest ? "bg-[#00C2A8]" : "bg-gray-200 dark:bg-slate-700"}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${weeklyDigest ? "left-4.5" : "left-0.5"}`} />
                      </button>
                    </div>

                    {/* Toggle row 4 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold">Security Alerts</p>
                        <p className="text-[10px] text-gray-400">Instant notification on account settings changes</p>
                      </div>
                      <button
                        onClick={() => setSecurityAlerts(!securityAlerts)}
                        className={`w-9 h-5 rounded-full transition relative ${securityAlerts ? "bg-[#00C2A8]" : "bg-gray-200 dark:bg-slate-700"}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${securityAlerts ? "left-4.5" : "left-0.5"}`} />
                      </button>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
