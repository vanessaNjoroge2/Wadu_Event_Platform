import "./styles/global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ExplorePage from "./pages/ExplorePage";
import EventDetailPage from "./pages/EventDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import CreateEventPage from "./pages/CreateEventPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/post-event" element={<CreateEventPage />} />
            <Route
              path="/categories"
              element={
                <PlaceholderPage
                  title="Browse Categories"
                  description="Coming soon: All event categories and curated collections."
                />
              }
            />
            <Route
              path="/cities"
              element={
                <PlaceholderPage
                  title="Browse by Cities"
                  description="Coming soon: Events by location."
                />
              }
            />
            <Route
              path="/sign-in"
              element={
                <PlaceholderPage
                  title="Sign In"
                  description="Coming soon: User authentication."
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <PlaceholderPage
                  title="Organizer Dashboard"
                  description="Coming soon: Manage your events and analytics."
                />
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
