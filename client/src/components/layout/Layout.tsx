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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      {showHero && (
        <div
          className="relative overflow-hidden py-20 md:py-32 px-4"
          style={{ background: "linear-gradient(135deg, #2d0060 0%, #0d0535 40%, #001845 100%)" }}
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
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>

          {/* Semi-transparent overlay — dark enough to read text, light enough to see video */}
          <div
            className="absolute inset-0"
            style={{ zIndex: 1, background: "linear-gradient(to bottom, rgba(10,0,30,0.25), rgba(10,0,30,0.20), rgba(5,0,20,0.45))" }}
          />

          {/* Content sits above video + overlay */}
          <div className="max-w-7xl mx-auto text-center relative" style={{ zIndex: 2 }}>
            <p className="text-purple-400 font-semibold text-sm uppercase tracking-widest mb-4">
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
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition"
                />
              </div>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition w-full sm:w-auto shadow-lg shadow-purple-600/30">
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
