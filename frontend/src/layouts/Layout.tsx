import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
  showHero?: boolean;
}

export function Layout({ children, showHero = false }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      {showHero && (
        <div className="relative overflow-hidden py-28 md:py-44 px-4 bg-wadu-black">

          {/* Self-hosted autoplay video background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-40"
            style={{ zIndex: 0 }}
          >
            <source src="/video 1.mp4" type="video/mp4" />
          </video>

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-wadu-black/75"
            style={{ zIndex: 1 }}
          />

          {/* Diagonal divider */}
          <div
            className="absolute bottom-0 left-0 w-full overflow-hidden leading-none"
            style={{ zIndex: 3, transform: 'translateY(1px)' }}
          >
            <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="w-full h-10 md:h-16 fill-white">
              <path d="M1200 80L0 80 0 0 1200 80z"></path>
            </svg>
          </div>

          {/* Hero content */}
          <div className="max-w-6xl mx-auto text-center relative px-4" style={{ zIndex: 2 }}>
            <div className="inline-block bg-wadu-yellow text-wadu-black font-extrabold text-xs md:text-sm uppercase tracking-widest px-4 py-1.5 mb-6 transform -skew-x-12">
              THE PREMIER GLOBAL EVENT PLATFORM
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-black text-white mb-4 leading-[1.05] tracking-tighter uppercase">
              <span className="text-wadu-yellow block">Discover. Book.</span>
              Experience.
            </h1>
            <p className="text-base md:text-xl text-slate-300 font-medium mb-10 max-w-xl mx-auto">
              The simplest way to find, book, and host events worldwide.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/explore"
                className="bg-wadu-yellow border-4 border-wadu-yellow text-wadu-black px-8 py-4 font-black uppercase text-base hover:bg-white hover:border-white transition duration-200 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)]"
              >
                Browse Events
              </a>
              <a
                href="/post-event"
                className="bg-transparent border-4 border-white text-white px-8 py-4 font-black uppercase text-base hover:bg-white hover:text-wadu-black transition duration-200"
              >
                Host an Event
              </a>
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
