import { Link } from "react-router-dom";
import { Twitter, Instagram, Linkedin, Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-wadu-black border-t-8 border-wadu-yellow text-white pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center select-none" style={{ gap: 0 }}>
              <span className="font-logo text-5xl leading-none text-white" style={{ letterSpacing: '0.05em' }}>
                Wadu
              </span>
              <span className="font-logo text-5xl leading-none text-wadu-yellow" style={{ marginLeft: '-1px' }}>
                .
              </span>
            </div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">
              Your Event, Our Platform.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
                { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
                { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
                { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
                { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`WADU on ${label}`}
                  className="bg-white text-wadu-black p-2 border-2 border-white hover:bg-wadu-yellow hover:border-wadu-yellow transition-all duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-wadu-yellow font-black text-xs tracking-widest uppercase border-b-2 border-wadu-yellow pb-2">
              Company
            </h4>
            <ul className="space-y-3 text-sm font-bold uppercase">
              {[
                { to: "/about", label: "About Us" },
                { to: "/careers", label: "Careers" },
                { to: "/press", label: "Press" },
                { to: "/blog", label: "Blog" },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-slate-400 hover:text-wadu-yellow transition duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-wadu-yellow font-black text-xs tracking-widest uppercase border-b-2 border-wadu-yellow pb-2">
              Support
            </h4>
            <ul className="space-y-3 text-sm font-bold uppercase">
              {[
                { to: "/help", label: "Help Center" },
                { to: "/contact", label: "Contact Us" },
                { to: "/terms", label: "Terms of Service" },
                { to: "/privacy", label: "Privacy Policy" },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-slate-400 hover:text-wadu-yellow transition duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organizers */}
          <div className="space-y-4">
            <h4 className="text-wadu-yellow font-black text-xs tracking-widest uppercase border-b-2 border-wadu-yellow pb-2">
              Organizers
            </h4>
            <ul className="space-y-3 text-sm font-bold uppercase">
              {[
                { to: "/post-event", label: "Create Event" },
                { to: "/organizer-dashboard", label: "Dashboard" },
                { to: "/pricing", label: "Pricing" },
                { to: "/resources", label: "Resources" },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-slate-400 hover:text-wadu-yellow transition duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t-2 border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">
            © 2024 WADU Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="text-xs text-slate-600 hover:text-wadu-yellow font-bold uppercase transition duration-200">
              Terms
            </Link>
            <Link to="/privacy" className="text-xs text-slate-600 hover:text-wadu-yellow font-bold uppercase transition duration-200">
              Privacy
            </Link>
            <Link to="/cookies" className="text-xs text-slate-600 hover:text-wadu-yellow font-bold uppercase transition duration-200">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
