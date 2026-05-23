import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

function PageHeader({ tag, title, subtitle }: { tag: string; title: string; subtitle: string }) {
  return (
    <div className="py-24 px-4 max-w-4xl mx-auto text-center">
      <p className="text-wadu-purple font-extrabold text-sm uppercase tracking-widest mb-3">{tag}</p>
      <h1 className="text-4xl md:text-5xl font-extrabold text-wadu-navy dark:text-white mb-4 leading-tight">{title}</h1>
      <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-semibold">{subtitle}</p>
    </div>
  );
}

export function AboutPage() {
  return (
    <Layout>
      <PageHeader
        tag="Our Story"
        title="About WADU"
        subtitle="We're building the world's most connected event platform."
      />
      <div className="max-w-4xl mx-auto px-4 pb-24 space-y-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-wadu-navy dark:text-white mb-4">Our Mission</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
              WADU connects people with extraordinary experiences. From intimate local gatherings to
              massive international festivals, we make it seamless to discover, book, and attend
              events that matter to you — anywhere in the world.
            </p>
          </div>
          <div className="bg-wadu-purple border border-wadu-purple/20 rounded-2xl p-8 text-white shadow-md">
            <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
            <p className="text-purple-100 leading-relaxed font-semibold">
              A world where every live experience is one tap away. We're building the infrastructure
              for the live events industry — from ticketing and payments to discovery and analytics.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "10M+", label: "Tickets Sold" },
            { value: "50K+", label: "Events Listed" },
            { value: "190+", label: "Countries" },
            { value: "2019", label: "Founded" },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <p className="text-3xl font-extrabold text-wadu-purple mb-1">{s.value}</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-wadu-navy dark:text-white mb-6">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Community First", desc: "Every decision we make is guided by the communities we serve — organizers, attendees, and partners." },
              { title: "Radical Transparency", desc: "No hidden fees, no surprises. We believe in honest pricing and open communication." },
              { title: "Global Reach, Local Heart", desc: "We think globally but act locally, celebrating the unique cultures of every city we serve." },
            ].map((v, i) => (
              <div key={i} className="space-y-2">
                <h3 className="text-wadu-navy dark:text-white font-bold text-base">{v.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-semibold">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export function CareersPage() {
  const roles = [
    { title: "Senior Frontend Engineer", team: "Engineering", location: "Nairobi / Remote", type: "Full-time" },
    { title: "Product Designer", team: "Design", location: "Lagos / Remote", type: "Full-time" },
    { title: "Growth Marketing Manager", team: "Marketing", location: "Remote", type: "Full-time" },
    { title: "Event Partnerships Lead", team: "Partnerships", location: "Cape Town / Remote", type: "Full-time" },
    { title: "Backend Engineer (Node.js)", team: "Engineering", location: "Remote", type: "Full-time" },
    { title: "Customer Success Manager", team: "Support", location: "Kigali / Remote", type: "Full-time" },
  ];

  return (
    <Layout>
      <PageHeader
        tag="Join the Team"
        title="Careers at WADU"
        subtitle="Help us build the future of live events. Remote-first, globally minded."
      />
      <div className="max-w-4xl mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { title: "Remote-First", desc: "Work from anywhere in the world." },
            { title: "Competitive Pay", desc: "Top-of-market salaries + equity." },
            { title: "Great Benefits", desc: "Health, wellness & learning budget." },
          ].map((p, i) => (
            <div key={i} className="bg-wadu-purple border border-wadu-purple/20 rounded-2xl p-6 text-center text-white shadow-md">
              <h3 className="text-white font-bold mb-2 text-base">{p.title}</h3>
              <p className="text-purple-100 text-sm font-semibold">{p.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-wadu-navy dark:text-white mb-6">Open Roles</h2>
        <div className="space-y-4">
          {roles.map((role, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-wadu-teal dark:hover:border-wadu-teal rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition group cursor-pointer shadow-sm duration-300">
              <div>
                <h3 className="text-wadu-navy dark:text-white font-bold text-lg group-hover:text-wadu-teal transition duration-200">{role.title}</h3>
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="text-wadu-purple text-xs font-bold bg-wadu-purple/10 px-3 py-1 rounded-full">{role.team}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 font-semibold"><MapPin size={12} className="text-wadu-teal" />{role.location}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">{role.type}</span>
                </div>
              </div>
              <button className="text-wadu-purple hover:text-wadu-teal flex items-center gap-1 text-sm font-bold transition flex-shrink-0 duration-200">
                Apply <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
          <p className="text-wadu-navy dark:text-white font-bold text-lg mb-2">Don't see your role?</p>
          <p className="text-slate-500 dark:text-slate-400 mb-6 font-semibold">Send us your CV and we'll reach out when something fits.</p>
          <a href="mailto:careers@wadu.dev" className="inline-block bg-wadu-navy border border-wadu-navy/15 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal transition duration-200 shadow-sm">
            Send Open Application
          </a>
        </div>
      </div>
    </Layout>
  );
}

export function PressPage() {
  return (
    <Layout>
      <PageHeader
        tag="Media & Press"
        title="Press Center"
        subtitle="Resources, news, and contact info for media inquiries."
      />
      <div className="max-w-4xl mx-auto px-4 pb-24 space-y-12">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { date: "May 2025", headline: "WADU raises $12M Series A to expand across Africa", outlet: "TechCabal" },
            { date: "Mar 2025", headline: "WADU named Africa's fastest-growing event platform", outlet: "Disrupt Africa" },
            { date: "Jan 2025", headline: "WADU surpasses 10 million tickets sold", outlet: "BusinessDay" },
            { date: "Nov 2024", headline: "How WADU is changing live events in East Africa", outlet: "Rest of World" },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-wadu-teal dark:hover:border-wadu-teal rounded-2xl p-6 transition duration-300 cursor-pointer group shadow-sm">
              <p className="text-wadu-purple text-xs font-bold mb-2">{item.outlet} · {item.date}</p>
              <h3 className="text-wadu-navy dark:text-white font-bold text-base group-hover:text-wadu-teal transition duration-200 leading-snug">{item.headline}</h3>
            </div>
          ))}
        </div>

        <div className="bg-wadu-purple border border-wadu-purple/20 rounded-2xl p-8 text-white shadow-md">
          <h2 className="text-2xl font-bold text-white mb-4">Media Enquiries</h2>
          <p className="text-purple-100 mb-6 font-semibold">For press enquiries, interview requests, or brand assets, contact our communications team.</p>
          <a href="mailto:press@wadu.dev" className="inline-flex items-center gap-2 bg-[#0A1F44] border border-white/10 hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal text-white px-6 py-3.5 rounded-xl font-bold transition duration-200 shadow-sm">
            <Mail size={18} /> press@wadu.dev
          </a>
        </div>
      </div>
    </Layout>
  );
}

export function BlogPage() {
  const posts = [
    { title: "How to sell out your next event in 30 days", category: "Tips", date: "May 10, 2025", read: "5 min read" },
    { title: "The rise of festival culture in East Africa", category: "Trends", date: "Apr 28, 2025", read: "7 min read" },
    { title: "WADU's guide to pricing event tickets", category: "Guide", date: "Apr 15, 2025", read: "6 min read" },
    { title: "5 lessons from hosting 1,000 events on WADU", category: "Organizers", date: "Apr 2, 2025", read: "8 min read" },
    { title: "What makes a great event page?", category: "Design", date: "Mar 20, 2025", read: "4 min read" },
    { title: "Building community through live events", category: "Community", date: "Mar 5, 2025", read: "5 min read" },
  ];

  return (
    <Layout>
      <PageHeader
        tag="Stories & Insights"
        title="WADU Blog"
        subtitle="Tips, trends, and stories from the world of live events."
      />
      <div className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <div key={i} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-wadu-teal dark:hover:border-wadu-teal rounded-2xl overflow-hidden transition duration-300 cursor-pointer shadow-sm">
              <div className="h-36 relative overflow-hidden bg-slate-100 dark:bg-slate-950">
                <img
                  src={`/image ${i + 9}.jpg`}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-wadu-purple text-xs font-bold uppercase tracking-widest">{post.category}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">{post.read}</span>
                </div>
                <h3 className="text-wadu-navy dark:text-white font-bold group-hover:text-wadu-teal transition duration-200 leading-snug mb-3 text-base">{post.title}</h3>
                <p className="text-slate-455 dark:text-slate-500 text-xs font-semibold">{post.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export function HelpPageContent() {
  const faqs = [
    { q: "How do I get a refund for a cancelled event?", a: "If an event is cancelled by the organiser, you'll automatically receive a full refund within 5-7 business days to your original payment method." },
    { q: "Can I transfer my ticket to someone else?", a: "Yes! You can transfer your ticket from your dashboard up to 24 hours before the event starts." },
    { q: "How do I download my e-ticket?", a: "After purchase, your e-ticket is emailed to you instantly and available in your dashboard under 'My Tickets'." },
    { q: "What payment methods do you accept?", a: "We accept M-Pesa, Visa, Mastercard, PayPal, and all major mobile money platforms across Africa." },
    { q: "How do I contact the event organiser?", a: "On the event detail page, click 'Contact Organiser' to send them a message directly." },
    { q: "Is my payment information secure?", a: "Absolutely. All payments are processed via PCI-DSS compliant payment processors. WADU never stores card details." },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 pb-24">
      <div className="space-y-4 mb-12">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-wadu-navy dark:text-white font-bold text-lg mb-3">{faq.q}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-semibold">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="bg-wadu-purple border border-wadu-purple/20 rounded-2xl p-8 text-center text-white shadow-md">
        <h2 className="text-2xl font-bold text-white mb-3">Still need help?</h2>
        <p className="text-purple-100 mb-6 font-semibold">Our support team is available 24/7 to assist you.</p>
        <Link to="/contact" className="inline-block bg-wadu-navy border border-wadu-navy/15 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal transition duration-200 shadow-sm">
          Contact Support
        </Link>
      </div>
    </div>
  );
}

export function HelpPage() {
  return (
    <Layout>
      <PageHeader
        tag="Support"
        title="Help Center"
        subtitle="Answers to the most common questions about WADU."
      />
      <HelpPageContent />
    </Layout>
  );
}

export function ContactPage() {
  return (
    <Layout>
      <PageHeader
        tag="Get in Touch"
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out anytime."
      />
      <div className="max-w-4xl mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div className="space-y-6 mb-8">
              {[
                { icon: Mail, label: "Email", value: "hello@wadu.dev" },
                { icon: Phone, label: "Phone", value: "+254 700 000 000" },
                { icon: MapPin, label: "HQ", value: "Nairobi, Kenya" },
              ].map((c, i) => {
                const Icon = c.icon;
                return (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-wadu-purple/10 dark:bg-wadu-purple/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-wadu-purple" />
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">{c.label}</p>
                      <p className="text-wadu-navy dark:text-white font-bold text-base">{c.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-md">
            <h2 className="text-xl font-bold text-wadu-navy dark:text-white mb-6">Send a Message</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Your name" className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder-slate-455 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold" />
              <input type="email" placeholder="Email address" className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder-slate-455 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold" />
              <select className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-500 dark:text-slate-400 focus:outline-none focus:border-wadu-teal transition duration-200 font-semibold">
                <option>General Enquiry</option>
                <option>Ticket Support</option>
                <option>Organiser Support</option>
                <option>Press</option>
                <option>Partnerships</option>
              </select>
              <textarea rows={4} placeholder="Your message..." className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder-slate-455 focus:outline-none focus:border-wadu-teal focus:ring-1 focus:ring-wadu-teal transition duration-200 font-semibold resize-none" />
              <button type="submit" className="w-full bg-wadu-navy border border-wadu-navy/15 text-white hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal py-3.5 rounded-xl font-bold transition duration-200 shadow-sm">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export function TermsPage() {
  return (
    <Layout>
      <PageHeader tag="Legal" title="Terms of Service" subtitle="Last updated: May 2025" />
      <div className="max-w-3xl mx-auto px-4 pb-24 space-y-8">
        {[
          { title: "1. Acceptance of Terms", body: "By accessing or using WADU's platform, website, or mobile application, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform." },
          { title: "2. Use of the Platform", body: "WADU grants you a limited, non-exclusive, non-transferable licence to use the platform for personal, non-commercial purposes. You agree not to misuse the platform, including attempting to circumvent security measures or defraud other users or event organisers." },
          { title: "3. Ticket Purchases", body: "All ticket sales are final unless an event is cancelled or significantly changed by the organiser. Refunds are processed within 5-7 business days. WADU is not responsible for the actions of event organisers." },
          { title: "4. User Accounts", body: "You are responsible for maintaining the confidentiality of your account credentials. You must notify WADU immediately of any unauthorised use of your account." },
          { title: "5. Intellectual Property", body: "All content on the WADU platform, including logos, text, and graphics, is the property of WADU Inc. or its licensors and is protected by applicable intellectual property laws." },
          { title: "6. Limitation of Liability", body: "WADU shall not be liable for indirect, incidental, or consequential damages arising from the use of the platform. Our total liability shall not exceed the amount paid by you in the past 12 months." },
          { title: "7. Changes to Terms", body: "WADU reserves the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms." },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-wadu-navy dark:text-white font-bold text-lg mb-3 leading-snug">{s.title}</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">{s.body}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export function PrivacyPage() {
  return (
    <Layout>
      <PageHeader tag="Legal" title="Privacy Policy" subtitle="Last updated: May 2025" />
      <div className="max-w-3xl mx-auto px-4 pb-24 space-y-8">
        {[
          { title: "Information We Collect", body: "We collect information you provide directly, such as your name, email address, and payment information when you create an account or purchase tickets. We also collect usage data through cookies and analytics tools." },
          { title: "How We Use Your Information", body: "We use your information to process transactions, send booking confirmations and updates, personalise your event recommendations, improve our platform, and send marketing communications (which you may opt out of at any time)." },
          { title: "Sharing Your Information", body: "We share your information with event organisers to fulfil your ticket purchase, payment processors to handle transactions, and service providers who assist in operating our platform. We do not sell your personal data to third parties." },
          { title: "Data Security", body: "We implement industry-standard security measures including TLS encryption, PCI-DSS compliant payment processing, and regular security audits to protect your personal information." },
          { title: "Cookies", body: "We use cookies and similar tracking technologies to enhance your experience, understand usage patterns, and serve relevant advertising. You can control cookies through your browser settings." },
          { title: "Your Rights", body: "You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at privacy@wadu.dev. We will respond within 30 days." },
          { title: "Contact", body: "For privacy-related questions or requests, contact our Data Protection Officer at privacy@wadu.dev or write to WADU Inc., Nairobi, Kenya." },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-wadu-navy dark:text-white font-bold text-lg mb-3 leading-snug">{s.title}</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">{s.body}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
