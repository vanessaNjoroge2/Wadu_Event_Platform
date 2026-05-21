import { Link } from "react-router-dom";
import { Twitter, Instagram, Linkedin, Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-16 px-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Column 1: About WADU */}
          <div className="space-y-3">
            <h3 className="text-white font-extrabold text-2xl tracking-wider">
              WADU
            </h3>
            <p className="text-sm text-slate-400">
              WADU - Your Event, Our Platform
            </p>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm tracking-widest uppercase">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="hover:text-white transition">
                  Press
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm tracking-widest uppercase">
              Support
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/help" className="hover:text-white transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Follow Us & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm tracking-widest uppercase">
              Follow Us
            </h3>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition"
                aria-label="WADU on Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition"
                aria-label="WADU on Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition"
                aria-label="WADU on Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition"
                aria-label="WADU on LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition"
                aria-label="WADU on YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>

            <div className="pt-2">
              <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-3">
                Newsletter
              </h3>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-slate-900 border border-slate-800 text-sm text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:border-wadu-purple"
                />
                <button className="bg-white hover:bg-slate-100 text-slate-950 text-sm font-semibold py-2 px-4 rounded-lg w-full transition text-center">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bottom Bar */}
        <div className="border-t border-slate-900 pt-8 text-center">
          <p className="text-xs text-slate-500 font-medium">
            © 2024 WADU Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
