import { Router, RequestHandler } from "express";
import { createEventSchema } from "../../shared/validation";
import { SharedEvent, EventsResponse } from "../../shared/api";
import { logger } from "../utils/logger";

const router = Router();

// Mock event list mirroring frontend events
const mockEvents: SharedEvent[] = [
  {
    id: 1,
    title: "AfroNation Nairobi 2025",
    category: "Music",
    location: "Nairobi, Kenya",
    date: "Fri, Dec 1, 2025 • 5:00 PM",
    price: "From KES 3,500",
    gradient: "from-purple-600 to-pink-600",
    status: "ON SALE",
    tag: "TRENDING",
  },
  {
    id: 2,
    title: "East Africa Tech Summit",
    category: "Tech",
    location: "Kigali, Rwanda",
    date: "Mon, Oct 20, 2025 • 9:00 AM",
    price: "From KES 2,000",
    gradient: "from-orange-500 to-red-500",
    status: "ON SALE",
    tag: "TRENDING",
  },
  {
    id: 3,
    title: "Lamu Cultural Festival",
    category: "Culture",
    location: "Lamu, Kenya",
    date: "Sat, Nov 15, 2025 • 10:00 AM",
    price: "From KES 1,200",
    gradient: "from-teal-500 to-green-500",
    status: "ON SALE",
    tag: "TRENDING",
  },
  {
    id: 4,
    title: "Nairobi Food Market",
    category: "Food & Drink",
    location: "Nairobi, Kenya",
    date: "Sun, Nov 26, 2025 • 12:00 PM",
    price: "From KES 1,500",
    gradient: "from-red-500 to-pink-600",
    status: "LAST 47 TICKETS",
    tag: "TRENDING",
  },
  {
    id: 5,
    title: "Nairobi Tech Week",
    category: "Tech",
    location: "Nairobi, Kenya",
    date: "Oct 15-18, 2024",
    price: "From KES 500",
    gradient: "from-blue-600 to-purple-600",
    status: "ON SALE",
  },
  {
    id: 6,
    title: "Safari Art Biennale",
    category: "Arts & Culture",
    location: "Mombasa, Kenya",
    date: "Fri, Dec 1, 2024 • 10:00 AM",
    price: "From KES 1,800",
    gradient: "from-yellow-600 to-orange-500",
    status: "ON SALE",
  },
];

// GET all events
const getEvents: RequestHandler = (req, res, next) => {
  try {
    const category = req.query.category as string | undefined;
    let filteredEvents = mockEvents;

    if (category) {
      filteredEvents = mockEvents.filter(
        (e) => e.category.toLowerCase() === category.toLowerCase()
      );
    }

    const response: EventsResponse = {
      events: filteredEvents,
      total: filteredEvents.length,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// GET single event by id
const getEventById: RequestHandler = (req, res, next) => {
  try {
    const idParam = req.params.id;
    if (typeof idParam !== "string") {
      res.status(400).json({ success: false, message: "Invalid event ID" });
      return;
    }
    const id = parseInt(idParam, 10);
    const event = mockEvents.find((e) => e.id === id);

    if (!event) {
      res.status(404).json({ success: false, message: "Event not found" });
      return;
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
};

// POST create a new event
const createEvent: RequestHandler = (req, res, next) => {
  try {
    const validatedData = createEventSchema.parse(req.body);

    const newEvent: SharedEvent = {
      id: mockEvents.length + 1,
      title: validatedData.title,
      category: validatedData.category,
      location: validatedData.location,
      date: validatedData.date,
      price: typeof validatedData.price === "number" 
        ? `From KES ${validatedData.price.toLocaleString()}` 
        : validatedData.price,
      gradient: "from-purple-600 to-pink-600", // Default beautiful gradient
      status: "ON SALE",
    };

    mockEvents.push(newEvent);
    logger.info(`Successfully created a new event: ${newEvent.title} (ID: ${newEvent.id})`);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    next(error);
  }
};

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);

export default router;
