import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Wallet,
  Settings,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Coins,
  BarChart3,
  Activity,
  Sliders,
  ShieldAlert,
  Trash2,
  UserCheck,
  RefreshCw,
  FileText,
  Clock,
  ArrowRight,
  TrendingDown
} from "lucide-react";

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [adminName, setAdminName] = useState("Admin Account");
  const [adminEmail, setAdminEmail] = useState("admin@wadu.io");
  const [loading, setLoading] = useState(true);

  // Active sub-view (tab)
  const currentPath = location.pathname;
  const getActiveTab = () => {
    if (currentPath.endsWith("/users")) return "users";
    if (currentPath.endsWith("/events")) return "events";
    if (currentPath.endsWith("/orders")) return "orders";
    if (currentPath.endsWith("/payouts")) return "payouts";
    if (currentPath.endsWith("/logs")) return "logs";
    return "overview";
  };
  const activeTab = getActiveTab();

  // Stats State
  const [stats, setStats] = useState({
    totalUsers: 0,
    organizerCount: 0,
    attendeeCount: 0,
    totalEvents: 0,
    publishedEventsCount: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
    totalOrders: 0,
    recentUsers: [] as any[],
    recentEvents: [] as any[],
    recentOrders: [] as any[],
  });

  // Resource Lists
  const [usersList, setUsersList] = useState<any[]>([]);
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [payoutsList, setPayoutsList] = useState<any[]>([
    { id: "PAY-9321", organizer: "Vanessa Njoroge", amount: 45000, date: "2026-06-10", status: "PENDING" },
    { id: "PAY-2849", organizer: "Sauti Sol Group", amount: 180000, date: "2026-06-09", status: "PAID" },
    { id: "PAY-1284", organizer: "Tech Summit Organizers", amount: 75000, date: "2026-06-08", status: "PENDING" }
  ]);

  // Search/Filters
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");
  const [eventSearch, setEventSearch] = useState("");
  const [eventStatusFilter, setEventStatusFilter] = useState("ALL");
  const [orderSearch, setOrderSearch] = useState("");

  const loadAllData = () => {
    setLoading(true);
    Promise.all([
      api.get("/admin/stats"),
      api.get("/admin/users"),
      api.get("/admin/events"),
      api.get("/admin/orders"),
      api.get("/auth/me")
    ])
      .then(([statsData, usersData, eventsData, ordersData, meData]: any) => {
        if (statsData) setStats(statsData);
        if (usersData) setUsersList(usersData);
        if (eventsData) setEventsList(eventsData);
        if (ordersData) setOrdersList(ordersData);
        if (meData) {
          setAdminName(`${meData.firstName} ${meData.lastName}`);
          setAdminEmail(meData.email);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading admin dashboard stats:", err);
        toast({
          title: "Error loading platform data",
          description: err.message || "Please make sure you are signed in as an administrator.",
          variant: "destructive"
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAllData();
  }, [currentPath]);

  // Actions
  const handleUpdateUserRole = (userId: string, newRole: string) => {
    api.patch(`/admin/users/${userId}/role`, { role: newRole })
      .then(() => {
        toast({
          title: "User Role Updated",
          description: `User role has been successfully changed to ${newRole}.`
        });
        loadAllData();
      })
      .catch((err) => {
        toast({
          title: "Failed to update role",
          description: err.message,
          variant: "destructive"
        });
      });
  };

  const handleDeleteUser = (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    api.delete(`/admin/users/${userId}`)
      .then(() => {
        toast({
          title: "User Deleted",
          description: "The user account was successfully removed from the system."
        });
        loadAllData();
      })
      .catch((err) => {
        toast({
          title: "Failed to delete user",
          description: err.message,
          variant: "destructive"
        });
      });
  };

  const handleUpdateEventStatus = (eventId: string, newStatus: string) => {
    api.patch(`/admin/events/${eventId}/status`, { status: newStatus })
      .then(() => {
        toast({
          title: "Event Status Updated",
          description: `Event has been marked as ${newStatus}.`
        });
        loadAllData();
      })
      .catch((err) => {
        toast({
          title: "Failed to update status",
          description: err.message,
          variant: "destructive"
        });
      });
  };

  const handleApprovePayout = (payoutId: string) => {
    setPayoutsList(prev =>
      prev.map(p => p.id === payoutId ? { ...p, status: "PAID" } : p)
    );
    toast({
      title: "Payout Approved",
      description: `Payout reference ${payoutId} has been paid.`
    });
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/sign-in");
  };

  // Memoized Filtered Lists
  const filteredUsers = useMemo(() => {
    return usersList.filter(u => {
      const name = `${u.firstName} ${u.lastName}`.toLowerCase();
      const email = u.email.toLowerCase();
      const query = userSearch.toLowerCase();
      const matchesSearch = name.includes(query) || email.includes(query);
      const matchesRole = userRoleFilter === "ALL" || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [usersList, userSearch, userRoleFilter]);

  const filteredEvents = useMemo(() => {
    return eventsList.filter(e => {
      const title = e.title.toLowerCase();
      const location = e.location.toLowerCase();
      const query = eventSearch.toLowerCase();
      const matchesSearch = title.includes(query) || location.includes(query);
      const matchesStatus = eventStatusFilter === "ALL" || e.status === eventStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [eventsList, eventSearch, eventStatusFilter]);

  const filteredOrders = useMemo(() => {
    return ordersList.filter(o => {
      const name = `${o.firstName} ${o.lastName}`.toLowerCase();
      const email = o.email.toLowerCase();
      const id = o.id.toLowerCase();
      const query = orderSearch.toLowerCase();
      return name.includes(query) || email.includes(query) || id.includes(query);
    });
  }, [ordersList, orderSearch]);

  const navigationItems = [
    { label: "Overview", icon: LayoutDashboard, path: "/admin-dashboard" },
    { label: "Manage Users", icon: Users, path: "/admin-dashboard/users" },
    { label: "Manage Events", icon: CalendarDays, path: "/admin-dashboard/events" },
    { label: "Orders & Sales", icon: FileText, path: "/admin-dashboard/orders" },
    { label: "Payouts Requests", icon: Wallet, path: "/admin-dashboard/payouts" },
    { label: "System Logs", icon: Activity, path: "/admin-dashboard/logs" }
  ];

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-200 ${darkMode ? "dark bg-slate-950 text-slate-100" : "bg-gray-50 text-gray-800"}`}>
      
      {/* ── SIDEBAR ── */}
      <aside className="w-[250px] min-w-[250px] bg-[#0A1F44] flex flex-col h-full shadow-2xl z-10 text-white">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-white tracking-tight">WADU</span>
            <span className="text-xs bg-[#6C4DFF] text-white px-2 py-0.5 rounded-full font-semibold">Admin</span>
          </Link>
        </div>

        {/* Profile */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C4DFF] to-[#00C2A8] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              AD
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{adminName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <ShieldAlert size={11} className="text-[#00C2A8]" />
                <span className="text-[#00C2A8] text-xs font-semibold">System Administrator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = item.path === "/admin-dashboard"
              ? activeTab === "overview"
              : activeTab === item.path.split("/").pop();

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group whitespace-nowrap ${
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

        {/* DarkMode & Logout */}
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
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-extrabold text-wadu-navy dark:text-white uppercase tracking-wider">
              {activeTab === "overview" && "Platform Overview"}
              {activeTab === "users" && "Manage Users"}
              {activeTab === "events" && "Moderate Events"}
              {activeTab === "orders" && "System Orders & Sales"}
              {activeTab === "payouts" && "Organizer Payouts"}
              {activeTab === "logs" && "Audit Logs & Platform Activity"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              className={`p-2 rounded-lg border transition ${darkMode ? "bg-slate-800 border-slate-700 hover:bg-slate-700" : "bg-white border-gray-200 hover:bg-gray-50"}`}
              title="Refresh Data"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <span className="text-xs text-gray-400 font-semibold">
              System Time: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </header>

        {/* Dashboard Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C4DFF]"></div>
              <p className="text-gray-400 font-bold">Fetching Platform Data...</p>
            </div>
          ) : (
            <>
              {/* ── VIEW: OVERVIEW ── */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* KPI 1 */}
                    <div className={`p-6 rounded-2xl border shadow-sm transition duration-300 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Platform Users</p>
                          <h3 className="text-3xl font-extrabold text-wadu-navy dark:text-white mt-2">{stats.totalUsers}</h3>
                        </div>
                        <div className="p-3 bg-purple-500/10 text-[#6C4DFF] rounded-xl">
                          <Users size={22} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 text-xs font-bold text-emerald-500">
                        <TrendingUp size={14} />
                        <span>{stats.organizerCount} Organizers / {stats.attendeeCount} Attendees</span>
                      </div>
                    </div>

                    {/* KPI 2 */}
                    <div className={`p-6 rounded-2xl border shadow-sm transition duration-300 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Platform Events</p>
                          <h3 className="text-3xl font-extrabold text-wadu-navy dark:text-white mt-2">{stats.totalEvents}</h3>
                        </div>
                        <div className="p-3 bg-teal-500/10 text-[#00C2A8] rounded-xl">
                          <CalendarDays size={22} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 text-xs font-bold text-emerald-500">
                        <TrendingUp size={14} />
                        <span>{stats.publishedEventsCount} Events Published</span>
                      </div>
                    </div>

                    {/* KPI 3 */}
                    <div className={`p-6 rounded-2xl border shadow-sm transition duration-300 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Tickets Sold</p>
                          <h3 className="text-3xl font-extrabold text-wadu-navy dark:text-white mt-2">{stats.totalTicketsSold}</h3>
                        </div>
                        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
                          <Coins size={22} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 text-xs font-bold text-emerald-500">
                        <TrendingUp size={14} />
                        <span>{stats.totalOrders} Transactions placed</span>
                      </div>
                    </div>

                    {/* KPI 4 */}
                    <div className={`p-6 rounded-2xl border shadow-sm transition duration-300 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Platform Volume</p>
                          <h3 className="text-2xl font-black text-[#00C2A8] mt-2">KES {stats.totalRevenue.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                          <BarChart3 size={22} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 text-xs font-bold text-[#6C4DFF]">
                        <TrendingUp size={14} />
                        <span>Platform fee: KES {(stats.totalRevenue * 0.1).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mid dashboard sections */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Users */}
                    <div className={`lg:col-span-1 p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                      <h3 className="font-extrabold text-lg mb-6 flex items-center gap-2">
                        <Users size={18} className="text-[#6C4DFF]" />
                        Recent Signups
                      </h3>
                      <div className="space-y-4">
                        {stats.recentUsers.map((u) => (
                          <div key={u.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-800 last:border-0">
                            <div>
                              <p className="font-bold text-sm text-wadu-navy dark:text-white">{u.firstName} {u.lastName}</p>
                              <p className="text-xs text-gray-400">{u.email}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role === "ADMIN" ? "bg-red-500/10 text-red-500" : u.role === "ORGANIZER" ? "bg-teal-500/10 text-[#00C2A8]" : "bg-purple-500/10 text-[#6C4DFF]"
                            }`}>
                              {u.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Events */}
                    <div className={`lg:col-span-1 p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                      <h3 className="font-extrabold text-lg mb-6 flex items-center gap-2">
                        <CalendarDays size={18} className="text-[#00C2A8]" />
                        New Events
                      </h3>
                      <div className="space-y-4">
                        {stats.recentEvents.map((e) => (
                          <div key={e.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-800 last:border-0">
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-wadu-navy dark:text-white truncate">{e.title}</p>
                              <p className="text-xs text-gray-400">{e.category}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              e.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-500" : "bg-yellow-500/10 text-yellow-500"
                            }`}>
                              {e.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className={`lg:col-span-1 p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                      <h3 className="font-extrabold text-lg mb-6 flex items-center gap-2">
                        <Coins size={18} className="text-amber-500" />
                        Transactions
                      </h3>
                      <div className="space-y-4">
                        {stats.recentOrders.map((o) => (
                          <div key={o.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-slate-800 last:border-0">
                            <div className="min-w-0">
                              <p className="font-bold text-sm text-wadu-navy dark:text-white truncate">{o.event.title}</p>
                              <p className="text-xs text-gray-400">{o.firstName} {o.lastName} · {o.paymentMethod}</p>
                            </div>
                            <span className="font-extrabold text-sm text-emerald-500">
                              KES {o.total.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── VIEW: USERS ── */}
              {activeTab === "users" && (
                <div className="space-y-6">
                  {/* Search Bar & Filter Controls */}
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search users by name, email..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-[#6C4DFF] ${
                          darkMode ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500" : "bg-white border-gray-200 text-gray-800"
                        }`}
                      />
                    </div>
                    <div className="flex gap-2">
                      {["ALL", "ATTENDEE", "ORGANIZER", "ADMIN"].map((r) => (
                        <button
                          key={r}
                          onClick={() => setUserRoleFilter(r)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition border whitespace-nowrap ${
                            userRoleFilter === r
                              ? "bg-[#6C4DFF] text-white border-[#6C4DFF]"
                              : darkMode
                              ? "bg-slate-900 border-slate-800 text-gray-300 hover:border-slate-700"
                              : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className={`text-xs uppercase tracking-wider ${darkMode ? "bg-slate-800/50 text-slate-400" : "bg-gray-50 text-gray-500"}`}>
                            <th className="px-6 py-4 font-semibold">User Info</th>
                            <th className="px-4 py-4 font-semibold">Phone</th>
                            <th className="px-4 py-4 font-semibold">Role</th>
                            <th className="px-4 py-4 font-semibold">Status</th>
                            <th className="px-4 py-4 font-semibold">Joined At</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((u) => (
                              <tr key={u.id} className={`transition-colors ${darkMode ? "hover:bg-slate-800/30" : "hover:bg-gray-50"}`}>
                                <td className="px-6 py-4">
                                  <div>
                                    <p className="font-bold text-wadu-navy dark:text-white">{u.firstName} {u.lastName}</p>
                                    <p className="text-xs text-gray-400">{u.email}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-gray-500 dark:text-gray-400 font-semibold">{u.phone || "N/A"}</td>
                                <td className="px-4 py-4">
                                  <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                                    u.role === "ADMIN" ? "bg-red-500/10 text-red-500" : u.role === "ORGANIZER" ? "bg-teal-500/10 text-[#00C2A8]" : "bg-purple-500/10 text-[#6C4DFF]"
                                  }`}>
                                    {u.role}
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.isVerified ? "bg-emerald-500/10 text-emerald-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                                    {u.isVerified ? "Verified" : "Pending"}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                  {u.role !== "ADMIN" && (
                                    <>
                                      <button
                                        onClick={() => handleUpdateUserRole(u.id, u.role === "ATTENDEE" ? "ORGANIZER" : "ATTENDEE")}
                                        className="text-xs font-bold text-[#6C4DFF] hover:underline whitespace-nowrap inline-block"
                                        title="Toggle Attendee/Organizer Role"
                                      >
                                        Toggle Role
                                      </button>
                                      <button
                                        onClick={() => handleDeleteUser(u.id)}
                                        className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline whitespace-nowrap inline-block"
                                        title="Delete user"
                                      >
                                        Delete
                                      </button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">No users matching search query.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ── VIEW: EVENTS ── */}
              {activeTab === "events" && (
                <div className="space-y-6">
                  {/* Search Bar & Filter Controls */}
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search events by title, location..."
                        value={eventSearch}
                        onChange={(e) => setEventSearch(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-[#6C4DFF] ${
                          darkMode ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500" : "bg-white border-gray-200 text-gray-800"
                        }`}
                      />
                    </div>
                    <div className="flex gap-2">
                      {["ALL", "PUBLISHED", "DRAFT", "CANCELLED"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setEventStatusFilter(s)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition border whitespace-nowrap ${
                            eventStatusFilter === s
                              ? "bg-[#6C4DFF] text-white border-[#6C4DFF]"
                              : darkMode
                              ? "bg-slate-900 border-slate-800 text-gray-300 hover:border-slate-700"
                              : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Events Table */}
                  <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className={`text-xs uppercase tracking-wider ${darkMode ? "bg-slate-800/50 text-slate-400" : "bg-gray-50 text-gray-500"}`}>
                            <th className="px-6 py-4 font-semibold">Event</th>
                            <th className="px-4 py-4 font-semibold">Organizer</th>
                            <th className="px-4 py-4 font-semibold">Date & Location</th>
                            <th className="px-4 py-4 font-semibold">Tiers (Capacity)</th>
                            <th className="px-4 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Moderation Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                          {filteredEvents.length > 0 ? (
                            filteredEvents.map((e) => (
                              <tr key={e.id} className={`transition-colors ${darkMode ? "hover:bg-slate-800/30" : "hover:bg-gray-50"}`}>
                                <td className="px-6 py-4">
                                  <div>
                                    <p className="font-bold text-wadu-navy dark:text-white">{e.title}</p>
                                    <p className="text-xs text-gray-400">{e.category}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div>
                                    <p className="font-bold text-gray-500 dark:text-gray-400">{e.organizer.firstName} {e.organizer.lastName}</p>
                                    <p className="text-xs text-gray-400">{e.organizer.email}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="space-y-0.5 text-xs text-gray-400">
                                    <p className="font-semibold">{new Date(e.startDate).toLocaleDateString()}</p>
                                    <p className="truncate">{e.location}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-4 font-semibold text-gray-400">
                                  {e.tickets.length} tier(s) ({e.tickets.reduce((acc: number, curr: any) => acc + curr.quantity, 0)} slots)
                                </td>
                                <td className="px-4 py-4">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                                    e.status === "PUBLISHED"
                                      ? "bg-emerald-500/10 text-emerald-500"
                                      : e.status === "DRAFT"
                                      ? "bg-gray-500/10 text-gray-500"
                                      : "bg-red-500/10 text-red-500"
                                  }`}>
                                    {e.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                  {e.status === "DRAFT" && (
                                    <button
                                      onClick={() => handleUpdateEventStatus(e.id, "PUBLISHED")}
                                      className="text-xs font-bold text-emerald-500 hover:text-emerald-700 hover:underline whitespace-nowrap inline-block"
                                    >
                                      Approve &amp; Publish
                                    </button>
                                  )}
                                  {e.status === "PUBLISHED" && (
                                    <button
                                      onClick={() => handleUpdateEventStatus(e.id, "CANCELLED")}
                                      className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline whitespace-nowrap inline-block"
                                    >
                                      Cancel Event
                                    </button>
                                  )}
                                  {e.status === "CANCELLED" && (
                                    <button
                                      onClick={() => handleUpdateEventStatus(e.id, "PUBLISHED")}
                                      className="text-xs font-bold text-[#6C4DFF] hover:underline whitespace-nowrap inline-block"
                                    >
                                      Restore Event
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">No events found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ── VIEW: ORDERS ── */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  {/* Search Bar */}
                  <div className="flex gap-4 items-center">
                    <div className="relative w-full md:w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search orders by attendee name, email, ref ID..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-[#6C4DFF] ${
                          darkMode ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500" : "bg-white border-gray-200 text-gray-800"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className={`text-xs uppercase tracking-wider ${darkMode ? "bg-slate-800/50 text-slate-400" : "bg-gray-50 text-gray-500"}`}>
                            <th className="px-6 py-4 font-semibold">Order ID</th>
                            <th className="px-4 py-4 font-semibold">Event</th>
                            <th className="px-4 py-4 font-semibold">Buyer Details</th>
                            <th className="px-4 py-4 font-semibold">Method & Status</th>
                            <th className="px-4 py-4 font-semibold">Total Amount</th>
                            <th className="px-4 py-4 font-semibold">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                          {filteredOrders.length > 0 ? (
                            filteredOrders.map((o) => (
                              <tr key={o.id} className={`transition-colors ${darkMode ? "hover:bg-slate-800/30" : "hover:bg-gray-50"}`}>
                                <td className="px-6 py-4 font-bold text-gray-500 dark:text-gray-400">{o.id}</td>
                                <td className="px-4 py-4 font-bold text-wadu-navy dark:text-white">{o.event.title}</td>
                                <td className="px-4 py-4">
                                  <div>
                                    <p className="font-semibold">{o.firstName} {o.lastName}</p>
                                    <p className="text-xs text-gray-400">{o.email}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="space-y-1">
                                    <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                      {o.paymentMethod}
                                    </span>
                                    <div>
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        o.paymentStatus === "PAID"
                                          ? "bg-emerald-500/10 text-emerald-500"
                                          : o.paymentStatus === "PENDING"
                                          ? "bg-yellow-500/10 text-yellow-500"
                                          : "bg-red-500/10 text-red-500"
                                      }`}>
                                        {o.paymentStatus}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 font-extrabold text-wadu-navy dark:text-white">KES {o.total.toLocaleString()}</td>
                                <td className="px-4 py-4 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleString()}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">No orders found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ── VIEW: PAYOUTS ── */}
              {activeTab === "payouts" && (
                <div className="space-y-6">
                  {/* Payouts Table */}
                  <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className={`text-xs uppercase tracking-wider ${darkMode ? "bg-slate-800/50 text-slate-400" : "bg-gray-50 text-gray-500"}`}>
                            <th className="px-6 py-4 font-semibold">Reference</th>
                            <th className="px-4 py-4 font-semibold">Organizer</th>
                            <th className="px-4 py-4 font-semibold">Amount</th>
                            <th className="px-4 py-4 font-semibold">Date</th>
                            <th className="px-4 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                          {payoutsList.map((p) => (
                            <tr key={p.id} className={`transition-colors ${darkMode ? "hover:bg-slate-800/30" : "hover:bg-gray-50"}`}>
                              <td className="px-6 py-4 font-bold text-gray-500 dark:text-gray-400">{p.id}</td>
                              <td className="px-4 py-4 font-bold text-wadu-navy dark:text-white">{p.organizer}</td>
                              <td className="px-4 py-4 font-extrabold text-emerald-500">KES {p.amount.toLocaleString()}</td>
                              <td className="px-4 py-4 text-gray-400 text-xs">{p.date}</td>
                              <td className="px-4 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                                  p.status === "PAID"
                                    ? "bg-emerald-500/10 text-emerald-500"
                                    : "bg-yellow-500/10 text-yellow-500"
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                {p.status === "PENDING" ? (
                                  <button
                                    onClick={() => handleApprovePayout(p.id)}
                                    className="bg-emerald-500 border border-emerald-500/10 text-white hover:bg-emerald-600 px-4 py-1.5 rounded-lg text-xs font-bold transition duration-200 whitespace-nowrap"
                                  >
                                    Release Funds
                                  </button>
                                ) : (
                                  <span className="text-gray-400 text-xs italic font-semibold">Released</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ── VIEW: LOGS ── */}
              {activeTab === "logs" && (
                <div className="space-y-6">
                  {/* System Event Timeline Log */}
                  <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}>
                    <h3 className="font-extrabold text-lg mb-6 flex items-center gap-2">
                      <Activity size={18} className="text-[#6C4DFF]" />
                      Real-Time Platform Activity Audit Logs
                    </h3>
                    <div className="relative border-l-2 border-slate-100 dark:border-slate-800 pl-6 ml-3 space-y-6">
                      {[
                        { time: "Just now", desc: "User database count synced. Platform stats compiled successfully.", type: "system" },
                        { time: "10 mins ago", desc: "Admin user vanessawanjiru2023@gmail.com initialized session dashboard.", type: "auth" },
                        { time: "1 hr ago", desc: "Event ID cmq8cvhwe0002... image path fallback resolved via onError callback.", type: "event" },
                        { time: "2 hrs ago", desc: "Payment request processed for General Admission ticket type via Card integration.", type: "order" },
                        { time: "Yesterday", desc: "Database seed operation completed: 3 users, 10 events, 30 tickets inserted.", type: "system" }
                      ].map((log, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#6C4DFF] border-2 border-white dark:border-slate-950" />
                          <p className="text-xs text-gray-400 font-semibold">{log.time}</p>
                          <p className="text-sm font-semibold text-wadu-navy dark:text-white mt-1 leading-relaxed">
                            {log.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
