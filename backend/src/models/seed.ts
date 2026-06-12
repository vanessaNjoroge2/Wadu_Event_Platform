import { PrismaClient, Role, EventStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear database
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.ticketType.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'vanessawanjiru2023@gmail.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Wadu',
      phone: '+254700000000',
      role: Role.ADMIN,
      isVerified: true,
    },
  });

  const organizer = await prisma.user.create({
    data: {
      email: 'organizer@wadu.io',
      password: hashedPassword,
      firstName: 'Organizer',
      lastName: 'Wadu',
      phone: '+254711111111',
      role: Role.ORGANIZER,
      isVerified: true,
    },
  });

  const attendee = await prisma.user.create({
    data: {
      email: 'attendee@wadu.io',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '+254722222222',
      role: Role.ATTENDEE,
      isVerified: true,
    },
  });

  const eventsData = [
    {
      title: "AfroNation Nairobi 2025",
      description: "Get ready for the ultimate African music experience! AfroNation Nairobi brings together the biggest names in Afrobeats, Amapiano, and Dancehall for an unforgettable two-day festival.",
      category: "Music",
      location: "Nairobi Club Grounds",
      city: "Nairobi",
      country: "Kenya",
      venueName: "Nairobi Club Grounds",
      address: "Ngong Road, Nairobi",
      startDate: new Date("2025-12-10T14:00:00Z"),
      endDate: new Date("2025-12-11T23:59:00Z"),
      startTime: "14:00",
      endTime: "23:59",
      imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600",
      status: EventStatus.PUBLISHED,
      tickets: [
        { name: "General Admission", description: "Standard single entry to the festival for both days", price: 2500, quantity: 5000 },
        { name: "VIP Access", description: "Fast track entry, designated VIP bar, and front stage area access", price: 7500, quantity: 1000 },
        { name: "VVIP Experience", description: "Premium lounge seating, complimentary drinks, artist meet & greet, and exclusive merchandise", price: 15000, quantity: 200 }
      ]
    },
    {
      title: "East Africa Tech Summit",
      description: "Connecting startups, investors, and tech enthusiasts across East Africa. Discussions on AI, FinTech, and sustainable tech innovation.",
      category: "Technology",
      location: "Sarit Expo Centre",
      city: "Nairobi",
      country: "Kenya",
      venueName: "Sarit Expo Centre",
      address: "Karuna Road, Westlands, Nairobi",
      startDate: new Date("2025-09-15T09:00:00Z"),
      endDate: new Date("2025-09-17T17:00:00Z"),
      startTime: "09:00",
      endTime: "17:00",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600",
      status: EventStatus.PUBLISHED,
      tickets: [
        { name: "Student Pass", description: "Valid student ID required at the gate", price: 500, quantity: 500 },
        { name: "Delegate Pass", description: "Full access to all tracks, workshops and networking lounge", price: 3000, quantity: 1500 },
        { name: "VIP Executive Pass", description: "Delegate benefits plus invite-only VIP dinner and investor speed dating", price: 10000, quantity: 150 }
      ]
    },
    {
      title: "Lamu Cultural Festival",
      description: "An annual celebration of Swahili culture, heritage, dhow races, donkey races, and traditional Swahili poetry in Lamu Old Town.",
      category: "Culture",
      location: "Lamu Seafront",
      city: "Lamu",
      country: "Kenya",
      venueName: "Lamu Seafront",
      address: "Lamu Island",
      startDate: new Date("2025-11-20T08:00:00Z"),
      endDate: new Date("2025-11-23T20:00:00Z"),
      startTime: "08:00",
      endTime: "20:00",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600",
      status: EventStatus.PUBLISHED,
      tickets: [
        { name: "Standard Entry", description: "Access to all public cultural exhibitions and festival zone", price: 1000, quantity: 2000 },
        { name: "Cultural Tour Package", description: "Standard entry plus guided tour of Lamu Old Town and museum entries", price: 3500, quantity: 500 },
        { name: "VIP Patron Pass", description: "Access to VIP dhow cruise, opening ceremony dinner, and patron seating", price: 12000, quantity: 100 }
      ]
    },
    {
      title: "Nairobi Food Market",
      description: "A food lover's paradise. Sample local and international cuisines from the best chefs, restaurants, and food trucks in the city.",
      category: "Food",
      location: "The Alchemist Bar",
      city: "Nairobi",
      country: "Kenya",
      venueName: "The Alchemist Bar",
      address: "Parklands Road, Westlands, Nairobi",
      startDate: new Date("2025-07-05T11:00:00Z"),
      endDate: new Date("2025-07-06T22:00:00Z"),
      startTime: "11:00",
      endTime: "22:00",
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600",
      status: EventStatus.PUBLISHED,
      tickets: [
        { name: "General Admission", description: "Entry to the market and standard live music area", price: 500, quantity: 3000 },
        { name: "Foodie Lover Pass", description: "Entry + 3 food sample vouchers and 1 drink voucher", price: 2000, quantity: 1000 },
        { name: "Connoisseur VIP Pass", description: "VIP fast track entry + exclusive wine tasting session and masterclass entry", price: 5000, quantity: 200 }
      ]
    },
    {
      title: "Nairobi Tech Week",
      description: "The largest tech developer event in Sub-Saharan Africa. Join hackathons, product showcases, and developer workshops.",
      category: "Technology",
      location: "iHub Nairobi",
      city: "Nairobi",
      country: "Kenya",
      venueName: "iHub Nairobi",
      address: "Senteu Plaza, Galana Road, Kilimani",
      startDate: new Date("2025-08-18T09:00:00Z"),
      endDate: new Date("2025-08-22T18:00:00Z"),
      startTime: "09:00",
      endTime: "18:00",
      imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600",
      status: EventStatus.PUBLISHED,
      tickets: [
        { name: "Hackathon Attendee", description: "Access to developers track, hackathon participation, and free lunch", price: 0, quantity: 200 },
        { name: "Regular Pass", description: "Access to developer panels, booths and workshops", price: 1500, quantity: 1000 },
        { name: "VIP Corporate Pass", description: "All benefits + recruiter database access and corporate lounge pass", price: 8000, quantity: 100 }
      ]
    },
    {
      title: "Safari Art Biennale",
      description: "An exhibition highlighting contemporary African fine arts, sculptures, and virtual reality digital art installations.",
      category: "Art",
      location: "Nairobi National Museum",
      city: "Nairobi",
      country: "Kenya",
      venueName: "Nairobi National Museum",
      address: "Museum Hill Road, Nairobi",
      startDate: new Date("2025-10-01T10:00:00Z"),
      endDate: new Date("2025-10-15T18:00:00Z"),
      startTime: "10:00",
      endTime: "18:00",
      imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600",
      status: EventStatus.PUBLISHED,
      tickets: [
        { name: "Regular Ticket", description: "Single-day access to art galleries and museum collections", price: 1200, quantity: 1500 },
        { name: "Artist Guild Pass", description: "Multi-day access + catalog book + entry to panel discussions", price: 3000, quantity: 300 },
        { name: "Gala Opening Pass", description: "Access to exclusive opening night gala with wine & cheese reception", price: 8500, quantity: 80 }
      ]
    },
    {
      title: "Sauti Sol Farewell Concert",
      description: "A legendary live performance celebration as Sauti Sol marks their final tour event. Come sing along to their classic tracks.",
      category: "Music",
      location: "Kasarani Stadium Annex",
      city: "Nairobi",
      country: "Kenya",
      venueName: "Kasarani Stadium Annex",
      address: "Thika Road, Nairobi",
      startDate: new Date("2025-12-20T16:00:00Z"),
      endDate: new Date("2025-12-21T01:00:00Z"),
      startTime: "16:00",
      endTime: "01:00",
      imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600",
      status: EventStatus.PUBLISHED,
      tickets: [
        { name: "General Admission", description: "Regular standing area", price: 3000, quantity: 8000 },
        { name: "VIP Golden Circle", description: "Standing area closest to the main stage and separate bars", price: 10000, quantity: 2000 },
        { name: "VVIP Sol Family Lounge", description: "Elevated seat, private lounge, buffet dinner, and exclusive gift pack", price: 25000, quantity: 300 }
      ]
    },
    {
      title: "Kenya Fashion Week 2025",
      description: "The premiere fashion event showcasing the latest designs from East Africa's leading fashion designers and models.",
      category: "Fashion",
      location: "Nairobi Serena Hotel",
      city: "Nairobi",
      country: "Kenya",
      venueName: "Nairobi Serena Hotel",
      address: "Processional Way, Nairobi",
      startDate: new Date("2025-10-24T18:00:00Z"),
      endDate: new Date("2025-10-26T23:00:00Z"),
      startTime: "18:00",
      endTime: "23:00",
      imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600",
      status: EventStatus.PUBLISHED,
      tickets: [
        { name: "Regular Admission", description: "Standard seat behind front rows", price: 2000, quantity: 1000 },
        { name: "Front Row Pass", description: "Front row seat + gift bag with beauty products", price: 6000, quantity: 200 },
        { name: "Couture Patron VIP", description: "Front row seat + pre-show champagne reception + designer meet", price: 15000, quantity: 50 }
      ]
    },
    {
      title: "Great Rift Valley Festival",
      description: "Experience the magic of camping under the stars while listening to acoustic, folk, and indie rock music by the lake.",
      category: "Music",
      location: "Naivasha Lakeside",
      city: "Naivasha",
      country: "Kenya",
      venueName: "Naivasha Lakeside Camp",
      address: "Moi South Lake Road, Naivasha",
      startDate: new Date("2025-08-30T12:00:00Z"),
      endDate: new Date("2025-08-31T18:00:00Z"),
      startTime: "12:00",
      endTime: "18:00",
      imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=600",
      status: EventStatus.PUBLISHED,
      tickets: [
        { name: "General Admission", description: "Festival grounds entry only (BYO camping gear)", price: 2500, quantity: 4000 },
        { name: "Glamping Pass", description: "Entry + pre-setup luxury tent with mattresses and bedding", price: 8000, quantity: 500 },
        { name: "Ultimate Explorer VIP", description: "Glamping + guided hike + boat ride + all-inclusive meals", price: 18000, quantity: 100 }
      ]
    },
    {
      title: "Lake Victoria Boat Show",
      description: "An exciting showcase of luxury yachts, leisure boats, water sports competitions, and lakeside networking.",
      category: "Sports",
      location: "Kisumu Yacht Club",
      city: "Kisumu",
      country: "Kenya",
      venueName: "Kisumu Yacht Club",
      address: "Yacht Club Road, Kisumu",
      startDate: new Date("2025-09-27T10:00:00Z"),
      endDate: new Date("2025-09-28T18:00:00Z"),
      startTime: "10:00",
      endTime: "18:00",
      imageUrl: "https://images.unsplash.com/photo-1505242859-548c415b228c?q=80&w=600",
      status: EventStatus.PUBLISHED,
      tickets: [
        { name: "Regular Entry", description: "Access to boat display area and lake viewing docks", price: 1000, quantity: 1500 },
        { name: "Boat Tour Experience", description: "Regular entry plus a 30-minute speed boat tour of Lake Victoria", price: 3000, quantity: 400 },
        { name: "VIP Deck Pass", description: "Access to clubhouse VIP deck + premium dining buffet + sailing package", price: 10000, quantity: 80 }
      ]
    }
  ];

  for (const eventInfo of eventsData) {
    const { tickets, ...eventFields } = eventInfo;
    const createdEvent = await prisma.event.create({
      data: {
        ...eventFields,
        organizerId: organizer.id,
      },
    });

    for (const ticket of tickets) {
      await prisma.ticketType.create({
        data: {
          ...ticket,
          eventId: createdEvent.id,
        },
      });
    }
  }

  console.log('Seeding database completed successfully!');
  console.log('=== SEEDED CREDENTIALS ===');
  console.log('Admin Account: email = vanessawanjiru2023@gmail.com, password = password123, role = admin');
  console.log('Organizer Account: email = organizer@wadu.io, password = password123, role = organizer');
  console.log('Attendee Account: email = attendee@wadu.io, password = password123, role = attendee');
  console.log('==========================');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
