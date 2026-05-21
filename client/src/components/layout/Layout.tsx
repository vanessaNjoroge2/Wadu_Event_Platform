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
        <div className="relative overflow-hidden py-20 md:py-32 px-4">
          {/* Full-width autoplay video background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover -z-20"
            poster="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-crowd-at-a-concert-with-a-man-on-stage-2993-large.mp4"
              type="video/mp4"
            />
          </video>

          {/* Dark gradient overlay so text stays readable */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/75 via-blue-950/65 to-slate-950/90" />

          {/* Subtle colour bloom on top of video */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto text-center relative">
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
