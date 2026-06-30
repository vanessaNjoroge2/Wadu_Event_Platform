import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { DarkModeToggle } from "@/components/common/DarkModeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const userRole = localStorage.getItem("userRole")?.toUpperCase() || "ATTENDEE";

  const handleSignOut = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    // Hide navbar when scrolling down past 150px, show when scrolling up
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else if (latest < previous) {
      setHidden(false);
    }

    // Toggle scroll active styling once scrolling past 50px
    if (latest > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky top-0 z-50 border-b border-white/10 bg-[#0A1F44] text-white transition-all duration-300 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center gap-2 group">
            <span className="text-white group-hover:text-wadu-teal font-extrabold tracking-tight transition duration-200">
              WADU
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/explore"
              className="text-slate-200 hover:text-wadu-teal transition text-sm font-semibold duration-200"
            >
              Explore
            </Link>
            <Link
              to="/categories"
              className="text-slate-200 hover:text-wadu-teal transition text-sm font-semibold duration-200"
            >
              Categories
            </Link>
            <Link
              to="/cities"
              className="text-slate-200 hover:text-wadu-teal transition text-sm font-semibold duration-200"
            >
              Cities
            </Link>
            {isLoggedIn && userRole === "ATTENDEE" && (
              <Link
                to="/dashboard"
                className="text-slate-200 hover:text-wadu-teal transition text-sm font-semibold flex items-center gap-1 duration-200"
              >
                My Dashboard
              </Link>
            )}
            {isLoggedIn && userRole === "ORGANIZER" && (
              <Link
                to="/organizer-dashboard"
                className="text-slate-200 hover:text-wadu-teal transition text-sm font-semibold flex items-center gap-1 duration-200"
              >
                Dashboard
              </Link>
            )}
            {isLoggedIn && userRole === "ADMIN" && (
              <Link
                to="/admin-dashboard"
                className="text-slate-200 hover:text-wadu-teal transition text-sm font-semibold flex items-center gap-1 duration-200"
              >
                Admin Dashboard
              </Link>
            )}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-9 h-9 rounded-full bg-wadu-purple text-white text-sm font-bold flex items-center justify-center hover:ring-2 hover:ring-wadu-teal transition focus:outline-none">
                    V
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#0A1F44] border border-white/10 text-white rounded-xl shadow-lg mt-2 min-w-[160px] p-1.5 z-50">
                  {userRole === "ATTENDEE" && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/dashboard"
                        className="block w-full px-3 py-2 text-sm font-bold rounded-lg text-slate-200 hover:text-wadu-teal hover:bg-white/10 transition cursor-pointer"
                      >
                        My Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {userRole === "ORGANIZER" && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/organizer-dashboard"
                        className="block w-full px-3 py-2 text-sm font-bold rounded-lg text-slate-200 hover:text-wadu-teal hover:bg-white/10 transition cursor-pointer"
                      >
                        Organizer Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {userRole === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/admin-dashboard"
                        className="block w-full px-3 py-2 text-sm font-bold rounded-lg text-slate-200 hover:text-wadu-teal hover:bg-white/10 transition cursor-pointer"
                      >
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-white/10 my-1" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-sm font-bold rounded-lg text-slate-200 hover:text-red-450 hover:bg-white/10 transition cursor-pointer"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="text-slate-200 hover:text-wadu-teal transition text-sm font-semibold duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="text-slate-200 hover:text-wadu-teal transition text-sm font-semibold duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
            {(!isLoggedIn || userRole !== "ATTENDEE") && (
              <Link
                to="/post-event"
                className="bg-wadu-purple hover:bg-wadu-teal hover:text-wadu-navy text-white px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-1.5 duration-200"
              >
                Post Event
              </Link>
            )}
            <DarkModeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <DarkModeToggle />
            <button
              className="text-white hover:text-wadu-teal p-2 transition duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 space-y-1 bg-[#0A1F44] px-2">
            <Link
              to="/explore"
              className="block text-slate-200 hover:text-wadu-teal py-2.5 text-sm font-medium transition duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              to="/categories"
              className="block text-slate-200 hover:text-wadu-teal py-2.5 text-sm font-medium transition duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              to="/cities"
              className="block text-slate-200 hover:text-wadu-teal py-2.5 text-sm font-medium transition duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cities
            </Link>
            {isLoggedIn && userRole === "ATTENDEE" && (
              <Link
                to="/dashboard"
                className="block text-slate-200 hover:text-wadu-teal py-2.5 text-sm font-medium transition duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Dashboard
              </Link>
            )}
            {isLoggedIn && userRole === "ORGANIZER" && (
              <Link
                to="/organizer-dashboard"
                className="block text-slate-200 hover:text-wadu-teal py-2.5 text-sm font-medium transition duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Organizer Dashboard
              </Link>
            )}
            {isLoggedIn && userRole === "ADMIN" && (
              <Link
                to="/admin-dashboard"
                className="block text-slate-200 hover:text-wadu-teal py-2.5 text-sm font-medium transition duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-slate-200 hover:text-red-400 py-2.5 text-sm font-medium transition duration-200"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="block text-slate-200 hover:text-wadu-teal py-2.5 text-sm font-medium transition duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="block text-slate-200 hover:text-wadu-teal py-2.5 text-sm font-medium transition duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
            {(!isLoggedIn || userRole !== "ATTENDEE") && (
              <Link
                to="/post-event"
                className="block bg-wadu-purple hover:bg-wadu-teal hover:text-wadu-navy text-white px-4 py-2.5 rounded-xl font-bold text-center mt-4 transition text-xs duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Post Event
              </Link>
            )}
          </div>
        )}
      </div>
    </motion.nav>
  );
}

