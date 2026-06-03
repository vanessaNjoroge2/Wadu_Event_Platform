export const SITE_NAME = "Wadu Global Event Platform";
export const SITE_DESCRIPTION = "Discover, create, and share exceptional experiences around the globe.";

export const EVENT_CATEGORIES = [
  { id: "music", label: "Music & Concerts", icon: "Music" },
  { id: "tech", label: "Technology & Science", icon: "Megaphone" },
  { id: "outdoors", label: "Outdoors & Adventure", icon: "Tent" },
  { id: "sports", label: "Sports & Fitness", icon: "Trophy" },
  { id: "community", label: "Community & Culture", icon: "Users" },
  { id: "arts", label: "Arts & Theatre", icon: "Palette" },
  { id: "food", label: "Food & Drink", icon: "Utensils" }
];

export const MOCK_EVENTS = [
  {
    id: 1,
    title: "Global Synthwave Symphony 2026",
    description: "Experience the ultimate retro-futuristic audio-visual journey with leading synthwave producers from across Europe.",
    date: "2026-06-15",
    time: "20:00",
    location: "Berlin Arena & Virtual Stream",
    price: 49.99,
    category: "music",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=60",
    organizer: "Neowave Records",
    ticketsAvailable: 150
  },
  {
    id: 2,
    title: "AI Pioneers Summit: Next Horizon",
    description: "Deep dive into agentic AI, cognitive architectures, and neural-symbolic systems with top scientists and researchers.",
    date: "2026-07-22",
    time: "09:00",
    location: "San Francisco Tech Hub & Metaverse",
    price: 299.00,
    category: "tech",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",
    organizer: "Future Tech Council",
    ticketsAvailable: 500
  },
  {
    id: 3,
    title: "Alpine High-Trail Odyssey",
    description: "A breathtaking 3-day guided hiking and survival experience across the majestic Swiss Alps.",
    date: "2026-08-05",
    time: "06:00",
    location: "Zermatt base camp, Switzerland",
    price: 189.50,
    category: "outdoors",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=60",
    organizer: "Peak Adventures Ltd.",
    ticketsAvailable: 25
  }
];
