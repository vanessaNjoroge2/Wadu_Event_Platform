import { Check, X } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for local events with basic ticketing needs.",
    features: [
      "Unlimited attendees per event",
      "Unlimited basic ticketing",
      "Standard email support",
    ],
    notIncluded: [
      "AI Audience Discovery",
      "Omni-channel Campaigns",
      "Advanced Outreach Analytics",
    ],
    cta: "Start for Free",
    ctaLink: "/sign-up",
    popular: false,
    color: "bg-white dark:bg-slate-900",
  },
  {
    name: "Growth",
    price: "$49",
    period: "/month",
    description: "For organizers who want AI to find their audience.",
    features: [
      "Unlimited attendees per event",
      "AI Audience Discovery (1,000 leads/mo)",
      "Omni-channel Campaigns (5,000 sends)",
      "Advanced Outreach Analytics",
      "Priority support",
    ],
    notIncluded: [],
    cta: "Get Started",
    ctaLink: "/sign-up",
    popular: true,
    color: "bg-wadu-yellow",
  },
  {
    name: "Pro",
    price: "$149",
    period: "/month",
    description: "Full AI outreach suite for professional event organizers.",
    features: [
      "Unlimited attendees per event",
      "AI Audience Discovery (10,000 leads/mo)",
      "Omni-channel Campaigns (50,000 sends)",
      "Advanced Outreach Analytics",
      "24/7 Priority support",
    ],
    notIncluded: [],
    cta: "Get Pro",
    ctaLink: "/sign-up",
    popular: false,
    color: "bg-wadu-teal",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For massive festivals and global platforms.",
    features: [
      "Unlimited attendees per event",
      "Unlimited AI Audience Discovery",
      "Unlimited messaging campaigns",
      "Custom AI models for your niche",
      "API access & webhooks",
      "Dedicated account manager",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    ctaLink: "/contact",
    popular: false,
    color: "bg-wadu-purple",
  }
];

export default function PricingPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-wadu-navy dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg md:text-xl font-bold text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Choose the perfect plan to grow your audience and sell out your events. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative flex flex-col border-4 border-wadu-black rounded-none shadow-[6px_6px_0px_0px_rgba(5,5,5,1)] transition-transform hover:-translate-y-1 ${plan.color} ${plan.popular ? "lg:-mt-4 lg:mb-4" : ""}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-wadu-black text-white px-4 py-1 text-xs font-black uppercase whitespace-nowrap">
                  Most Popular
                </div>
              )}
              
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <h3 className={`text-2xl font-black uppercase mb-2 ${plan.name === "Enterprise" ? "text-white" : "text-wadu-navy"}`}>
                  {plan.name}
                </h3>
                <div className={`mb-4 flex items-baseline ${plan.name === "Enterprise" ? "text-white" : "text-wadu-navy"}`}>
                  <span className="text-4xl md:text-5xl font-black">{plan.price}</span>
                  {plan.period && <span className="text-lg font-bold ml-1 opacity-80">{plan.period}</span>}
                </div>
                <p className={`text-sm font-bold mb-8 ${plan.name === "Enterprise" ? "text-purple-200" : "text-slate-600"}`}>
                  {plan.description}
                </p>

                <div className="space-y-4 mb-8 flex-1">
                  {plan.features.map(feature => (
                    <div key={feature} className="flex items-start gap-3">
                      <div className={`mt-0.5 rounded-full p-0.5 border-2 border-current ${plan.name === "Enterprise" ? "text-white" : "text-wadu-black"}`}>
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span className={`text-sm font-bold ${plan.name === "Enterprise" ? "text-white" : "text-wadu-navy"}`}>{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map(feature => (
                    <div key={feature} className="flex items-start gap-3 opacity-50">
                      <div className={`mt-0.5 rounded-full p-0.5 border-2 border-current ${plan.name === "Enterprise" ? "text-white" : "text-wadu-black"}`}>
                        <X size={12} strokeWidth={4} />
                      </div>
                      <span className={`text-sm font-bold line-through ${plan.name === "Enterprise" ? "text-white" : "text-wadu-navy"}`}>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to={plan.ctaLink}
                  className={`block w-full py-4 text-center text-sm font-black uppercase border-4 transition-colors ${
                    plan.name === "Enterprise" 
                      ? "bg-white text-wadu-purple border-white hover:bg-transparent hover:text-white"
                      : "bg-wadu-black text-white border-wadu-black hover:bg-transparent hover:text-wadu-black"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-black uppercase text-center text-wadu-navy dark:text-white mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "How does the AI Audience Discovery work?",
                a: "Our AI engine analyzes your event details and scrapes public data to find high-intent leads who are likely to attend. We provide you with their professional information and verified contact details to run targeted campaigns."
              },
              {
                q: "Are there any hidden ticketing fees?",
                a: "No! WADU charges a flat 5% per ticket sold for all paid events. Free events are always 100% free to host."
              },
              {
                q: "Can I upgrade or downgrade my plan?",
                a: "Absolutely. You can change your plan at any time from your billing dashboard. If you upgrade mid-month, you'll be prorated."
              },
              {
                q: "Do I need a WhatsApp Business account for campaigns?",
                a: "We provide a shared WADU WhatsApp sender by default. If you're on the Pro or Enterprise plan, you can easily connect your own WhatsApp Business API number for custom branding."
              }
            ].map((faq, i) => (
              <div key={i} className="border-4 border-wadu-black rounded-none p-6 shadow-[4px_4px_0px_0px_rgba(5,5,5,1)] bg-white dark:bg-slate-900">
                <h3 className="text-lg font-black uppercase text-wadu-navy dark:text-white mb-2">{faq.q}</h3>
                <p className="font-bold text-slate-600 dark:text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
