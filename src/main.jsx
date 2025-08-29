import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { OrganizationProvider } from "./context/OrganizationContext";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { setupGlobalErrorHandling } from "./lib/errorHandler";

// Setup global error handling
setupGlobalErrorHandling();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary
      title="Application Error"
      message="The application encountered an unexpected error. Please refresh the page or contact support."
      onError={(error, errorInfo) => {
        console.error('Root ErrorBoundary caught error:', error, errorInfo);
      }}
    >
      <BrowserRouter>
        <OrganizationProvider>
          <App />
        </OrganizationProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
