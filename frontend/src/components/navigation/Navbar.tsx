import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
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
      className={`sticky top-0 z-50 border-b-4 border-wadu-black bg-wadu-yellow text-wadu-black transition-all duration-300 ${scrolled ? 'shadow-[0px_8px_0px_0px_rgba(5,5,5,1)]' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group select-none" style={{ gap: 0 }}>
            <span className="font-logo text-4xl leading-none text-wadu-black" style={{ letterSpacing: '0.05em' }}>
              Wadu
            </span>
            <span className="font-logo text-4xl leading-none text-wadu-yellow" style={{ marginLeft: '-1px' }}>
              .
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/explore"
              className="text-wadu-black hover:text-white transition-colors text-sm font-black uppercase duration-200"
            >
              Explore
            </Link>
            <Link
              to="/categories"
              className="text-wadu-black hover:text-white transition-colors text-sm font-black uppercase duration-200"
            >
              Categories
            </Link>
            <Link
              to="/cities"
              className="text-wadu-black hover:text-white transition-colors text-sm font-black uppercase duration-200"
            >
              Cities
            </Link>
            <Link
              to="/pricing"
              className="text-wadu-black hover:text-white transition-colors text-sm font-black uppercase duration-200"
            >
              Pricing
            </Link>
            {isLoggedIn && userRole === "ATTENDEE" && (
              <Link
                to="/dashboard"
                className="text-wadu-black hover:text-white transition-colors text-sm font-black uppercase flex items-center gap-1 duration-200"
              >
                My Dashboard
              </Link>
            )}
            {isLoggedIn && userRole === "ORGANIZER" && (
              <Link
                to="/organizer-dashboard"
                className="text-wadu-black hover:text-white transition-colors text-sm font-black uppercase flex items-center gap-1 duration-200"
              >
                Dashboard
              </Link>
            )}
            {isLoggedIn && userRole === "ADMIN" && (
              <Link
                to="/admin-dashboard"
                className="text-wadu-black hover:text-white transition-colors text-sm font-black uppercase flex items-center gap-1 duration-200"
              >
                Admin Dashboard
              </Link>
            )}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-10 h-10 rounded-none border-2 border-wadu-black bg-white text-wadu-black text-sm font-black uppercase flex items-center justify-center hover:bg-wadu-black hover:text-wadu-yellow transition focus:outline-none">
                    U
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-4 border-wadu-black text-wadu-black rounded-none shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] mt-4 min-w-[160px] p-0 z-50">
                  {userRole === "ATTENDEE" && (
                    <DropdownMenuItem asChild className="rounded-none focus:bg-wadu-yellow focus:text-wadu-black cursor-pointer px-4 py-3 border-b-2 border-wadu-black last:border-b-0">
                      <Link
                        to="/dashboard"
                        className="block w-full font-black uppercase"
                      >
                        My Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {userRole === "ORGANIZER" && (
                    <DropdownMenuItem asChild className="rounded-none focus:bg-wadu-yellow focus:text-wadu-black cursor-pointer px-4 py-3 border-b-2 border-wadu-black last:border-b-0">
                      <Link
                        to="/organizer-dashboard"
                        className="block w-full font-black uppercase"
                      >
                        Organizer Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {userRole === "ADMIN" && (
                    <DropdownMenuItem asChild className="rounded-none focus:bg-wadu-yellow focus:text-wadu-black cursor-pointer px-4 py-3 border-b-2 border-wadu-black last:border-b-0">
                      <Link
                        to="/admin-dashboard"
                        className="block w-full font-black uppercase"
                      >
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="block w-full text-left font-black uppercase rounded-none focus:bg-red-500 focus:text-white cursor-pointer px-4 py-3"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="text-wadu-black hover:text-white transition-colors text-sm font-black uppercase duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="text-wadu-black hover:text-white transition-colors text-sm font-black uppercase duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
            {isLoggedIn && userRole === "ORGANIZER" && (
              <Link
                to="/post-event"
                className="bg-wadu-black hover:bg-white hover:text-wadu-black text-wadu-yellow border-2 border-wadu-black px-6 py-2.5 rounded-none font-black text-xs uppercase transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] flex items-center gap-1.5 duration-200"
              >
                Post Event
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              className="text-wadu-black hover:text-white p-2 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t-4 border-wadu-black space-y-1 bg-wadu-yellow px-2 pt-2">
            <Link
              to="/explore"
              className="block text-wadu-black hover:bg-wadu-black hover:text-wadu-yellow px-4 py-3 text-sm font-black uppercase transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              to="/categories"
              className="block text-wadu-black hover:bg-wadu-black hover:text-wadu-yellow px-4 py-3 text-sm font-black uppercase transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              to="/cities"
              className="block text-wadu-black hover:bg-wadu-black hover:text-wadu-yellow px-4 py-3 text-sm font-black uppercase transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cities
            </Link>
            <Link
              to="/pricing"
              className="block text-wadu-black hover:bg-wadu-black hover:text-wadu-yellow px-4 py-3 text-sm font-black uppercase transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            {isLoggedIn && userRole === "ATTENDEE" && (
              <Link
                to="/dashboard"
                className="block text-wadu-black hover:bg-wadu-black hover:text-wadu-yellow px-4 py-3 text-sm font-black uppercase transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Dashboard
              </Link>
            )}
            {isLoggedIn && userRole === "ORGANIZER" && (
              <Link
                to="/organizer-dashboard"
                className="block text-wadu-black hover:bg-wadu-black hover:text-wadu-yellow px-4 py-3 text-sm font-black uppercase transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Organizer Dashboard
              </Link>
            )}
            {isLoggedIn && userRole === "ADMIN" && (
              <Link
                to="/admin-dashboard"
                className="block text-wadu-black hover:bg-wadu-black hover:text-wadu-yellow px-4 py-3 text-sm font-black uppercase transition-colors duration-200"
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
                className="block w-full text-left text-wadu-black hover:bg-red-500 hover:text-white px-4 py-3 text-sm font-black uppercase transition-colors duration-200"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="block text-wadu-black hover:bg-wadu-black hover:text-wadu-yellow px-4 py-3 text-sm font-black uppercase transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="block text-wadu-black hover:bg-wadu-black hover:text-wadu-yellow px-4 py-3 text-sm font-black uppercase transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
            {isLoggedIn && userRole === "ORGANIZER" && (
              <Link
                to="/post-event"
                className="block bg-wadu-black hover:bg-white hover:text-wadu-black text-wadu-yellow border-2 border-wadu-black px-4 py-3 font-black text-center mt-4 transition-colors text-sm uppercase duration-200"
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

