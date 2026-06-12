import "./styles/global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ExplorePage from "./pages/ExplorePage";
import EventDetailPage from "./pages/EventDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import CreateEventPage from "./pages/CreateEventPage";
import CategoriesPage from "./pages/CategoriesPage";
import CitiesPage from "./pages/CitiesPage";
import SignInPage from "./pages/SignInPage";
import DashboardPage from "./pages/DashboardPage";
import OrganizerDashboardPage from "./pages/OrganizerDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import {
  AboutPage,
  CareersPage,
  PressPage,
  BlogPage,
  HelpPage,
  ContactPage,
  TermsPage,
  PrivacyPage,
} from "./pages/FooterPages";

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
            <Route
              path="/post-event"
              element={
                <ProtectedRoute roleRequired="organizer">
                  <CreateEventPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-event"
              element={
                <ProtectedRoute roleRequired="organizer">
                  <CreateEventPage />
                </ProtectedRoute>
              }
            />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/cities" element={<CitiesPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roleRequired="attendee">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer-dashboard/*"
              element={
                <ProtectedRoute roleRequired="organizer">
                  <OrganizerDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard/*"
              element={
                <ProtectedRoute roleRequired="admin">
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/press" element={<PressPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

