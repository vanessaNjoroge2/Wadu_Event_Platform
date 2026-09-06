import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.JSX.Element;
  roleRequired?: "attendee" | "organizer" | "admin";
}

export function ProtectedRoute({ children, roleRequired }: ProtectedRouteProps) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = (localStorage.getItem("userRole") || "ATTENDEE").toLowerCase();

  if (!isLoggedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (roleRequired && userRole !== roleRequired.toLowerCase()) {
    if (userRole === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }
    if (userRole === "organizer") {
      return <Navigate to="/organizer-dashboard" replace />;
    }
    return <Navigate to="/explore" replace />;
  }

  return children;
}
