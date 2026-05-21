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
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/85 dark:bg-wadu-dark/90 backdrop-blur-md border-slate-200/85 dark:border-slate-800/85 shadow-lg shadow-wadu-navy/5 dark:shadow-wadu-navy/10"
          : "bg-white dark:bg-wadu-dark border-slate-200 dark:border-slate-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-wadu-purple to-wadu-teal font-extrabold tracking-tight">
              WADU
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/explore"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition text-sm font-semibold"
            >
              Explore
            </Link>
            <Link
              to="/categories"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition text-sm font-semibold"
            >
              Categories
            </Link>
            <Link
              to="/cities"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition text-sm font-semibold"
            >
              Cities
            </Link>
            <Link
              to="/dashboard"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition text-sm font-semibold flex items-center gap-1"
            >
              My Dashboard
            </Link>
            <Link
              to="/sign-in"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition text-sm font-semibold"
            >
              Sign In
            </Link>
            <Link
              to="/post-event"
              className="bg-wadu-purple hover:bg-[#5a3de0] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md shadow-wadu-purple/10 flex items-center gap-1.5"
            >
              Post Event
            </Link>
            <DarkModeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <DarkModeToggle />
            <button
              className="text-slate-800 dark:text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <Link
              to="/explore"
              className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2.5 text-sm font-medium"
            >
              Explore
            </Link>
            <Link
              to="/categories"
              className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2.5 text-sm font-medium"
            >
              Categories
            </Link>
            <Link
              to="/cities"
              className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2.5 text-sm font-medium"
            >
              Cities
            </Link>
            <Link
              to="/dashboard"
              className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2.5 text-sm font-medium"
            >
              My Dashboard
            </Link>
            <Link
              to="/sign-in"
              className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2.5 text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/post-event"
              className="block bg-wadu-purple hover:bg-[#5a3de0] text-white px-4 py-2.5 rounded-xl font-bold text-center mt-4 transition text-xs"
            >
              Post Event
            </Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
