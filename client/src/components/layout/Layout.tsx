import { ReactNode } from "react";
import { Search } from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
  showHero?: boolean;
}

export function Layout({ children, showHero = false }: LayoutProps) {
  return (
    <div className="min-h-screen bg-wadu-bg dark:bg-wadu-dark text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      {showHero && (
        <div
          className="relative overflow-hidden py-28 md:py-40 px-4"
          style={{ background: "linear-gradient(135deg, #0A1F44 0%, #061229 100%)" }}
        >

          {/* Self-hosted autoplay video background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 0 }}
          >
            <source src="/video 1.mp4" type="video/mp4" />
          </video>

          {/* Semi-transparent overlay — dark enough to read text, light enough to see video */}
          <div
            className="absolute inset-0"
            style={{ zIndex: 1, background: "linear-gradient(to bottom, rgba(10,31,68,0.4), rgba(10,31,68,0.35), rgba(15,23,42,0.6))" }}
          />

          {/* Content sits above video + overlay */}
          <div className="max-w-7xl mx-auto text-center relative" style={{ zIndex: 2 }}>
            <p className="text-wadu-purple font-extrabold text-sm uppercase tracking-widest mb-4">
              THE WORLD'S EVENTS, ONE PLATFORM
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Discover. Book.
              <br />
              Experience.
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto drop-shadow">
              The global platform for unforgettable events.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search events, cities, venues..."
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-wadu-teal transition"
                />
              </div>
              <button className="bg-wadu-navy border border-wadu-navy hover:bg-wadu-teal hover:border-wadu-teal hover:text-wadu-navy text-white px-8 py-3 rounded-lg font-bold transition w-full sm:w-auto shadow-md">
                Search
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}
