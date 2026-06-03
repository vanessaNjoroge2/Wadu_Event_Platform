import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { DarkModeToggle } from "@/components/common/DarkModeToggle";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
            <Link
              to="/dashboard"
              className="text-slate-200 hover:text-wadu-teal transition text-sm font-semibold flex items-center gap-1 duration-200"
            >
              My Dashboard
            </Link>
            <Link
              to="/sign-in"
              className="text-slate-200 hover:text-wadu-teal transition text-sm font-semibold duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/post-event"
              className="bg-wadu-purple hover:bg-wadu-teal hover:text-wadu-navy text-white px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md flex items-center gap-1.5 duration-200"
            >
              Post Event
            </Link>
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
            >
              Explore
            </Link>
            <Link
              to="/categories"
              className="block text-slate-200 hover:text-wadu-teal py-2.5 text-sm font-medium transition duration-200"
            >
              Categories
            </Link>
            <Link
              to="/cities"
              className="block text-slate-200 hover:text-wadu-teal py-2.5 text-sm font-medium transition duration-200"
            >
              Cities
            </Link>
            <Link
              to="/dashboard"
              className="block text-slate-200 hover:text-wadu-teal py-2.5 text-sm font-medium transition duration-200"
            >
              My Dashboard
            </Link>
            <Link
              to="/sign-in"
              className="block text-slate-200 hover:text-wadu-teal py-2.5 text-sm font-medium transition duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/post-event"
              className="block bg-wadu-purple hover:bg-wadu-teal hover:text-wadu-navy text-white px-4 py-2.5 rounded-xl font-bold text-center mt-4 transition text-xs duration-200"
            >
              Post Event
            </Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
