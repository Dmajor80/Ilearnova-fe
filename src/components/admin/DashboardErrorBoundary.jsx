import React from "react";
import { AlertTriangle, RefreshCw, Home, BarChart3 } from "lucide-react";
import { logError } from "@/lib/errorHandler";

/**
 * Enhanced error boundary specifically for dashboard components.
 * Provides dashboard-specific error handling and recovery options.
 */
class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0,
      errorType: "unknown"
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error using our error handler
    const appError = logError(error, {
      component: "Dashboard",
      errorInfo,
      timestamp: new Date().toISOString()
    });

    // Determine error type for better UX
    let errorType = "unknown";
    if (error.message?.includes("fetch") || error.message?.includes("network")) {
      errorType = "network";
    } else if (error.message?.includes("auth") || error.message?.includes("unauthorized")) {
      errorType = "auth";
    } else if (error.message?.includes("data") || error.message?.includes("parse")) {
      errorType = "data";
    }

    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorType: errorType
    });

    // Call parent error handler if provided
    if (this.props.onError) {
      this.props.onError(appError, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));

    // Call retry callback if provided
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  handleGoHome = () => {
    window.location.href = '/admin-dashboard';
  };

  handleRefreshPage = () => {
    window.location.reload();
  };

  getErrorContent() {
    const { errorType } = this.state;
    
    switch (errorType) {
      case "network":
        return {
          title: "Connection Problem",
          message: "Unable to connect to the server. Please check your internet connection and try again.",
          icon: <AlertTriangle className="w-8 h-8 text-orange-600" />,
          actions: [
            { label: "Retry", action: this.handleRetry, primary: true },
            { label: "Refresh Page", action: this.handleRefreshPage }
          ]
        };
      
      case "auth":
        return {
          title: "Authentication Error",
          message: "Your session may have expired. Please refresh the page or log in again.",
          icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
          actions: [
            { label: "Refresh Page", action: this.handleRefreshPage, primary: true },
            { label: "Go to Login", action: () => window.location.href = '/login' }
          ]
        };
      
      case "data":
        return {
          title: "Data Loading Error",
          message: "There was a problem loading the dashboard data. This might be a temporary issue.",
          icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
          actions: [
            { label: "Retry", action: this.handleRetry, primary: true },
            { label: "Go to Dashboard", action: this.handleGoHome }
          ]
        };
      
      default:
        return {
          title: "Something Went Wrong",
          message: "An unexpected error occurred while loading the dashboard. Our team has been notified.",
          icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
          actions: [
            { label: "Try Again", action: this.handleRetry, primary: true },
            { label: "Refresh Page", action: this.handleRefreshPage },
            { label: "Go Home", action: this.handleGoHome }
          ]
        };
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      const errorContent = this.getErrorContent();
      const isDark = this.props.darkMode || false;

      return (
        <div className={`min-h-screen flex items-center justify-center p-6 ${
          isDark 
            ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black" 
            : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
        }`}>
          <div className={`max-w-lg w-full rounded-2xl p-8 shadow-xl text-center ${
            isDark 
              ? "bg-gray-900/60 border border-gray-700 text-gray-100" 
              : "bg-white border border-gray-200 text-gray-800"
          }`}>
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isDark ? "bg-red-900/30" : "bg-red-100"
              }`}>
                {errorContent.icon}
              </div>
            </div>

            {/* Error Title */}
            <h2 className="text-2xl font-bold mb-4">
              {errorContent.title}
            </h2>
            
            {/* Error Message */}
            <p className={`mb-6 leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}>
              {errorContent.message}
            </p>

            {/* Error Details in Development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={`mb-6 text-left p-4 rounded-lg ${
                isDark ? "bg-gray-800/50" : "bg-gray-50"
              }`}>
                <summary className="cursor-pointer font-medium mb-2">
                  Error Details (Development)
                </summary>
                <pre className={`text-xs overflow-auto max-h-32 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {errorContent.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                    action.primary
                      ? isDark
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                      : isDark
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                  disabled={action.label === "Try Again" && this.state.retryCount >= 3}
                >
                  {action.label === "Try Again" && <RefreshCw className="w-4 h-4" />}
                  {action.label === "Go Home" && <Home className="w-4 h-4" />}
                  {action.label === "Try Again" && this.state.retryCount >= 3 
                    ? "Max Retries" 
                    : action.label
                  }
                </button>
              ))}
            </div>

            {/* Retry Count */}
            {this.state.retryCount > 0 && (
              <p className={`mt-4 text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                Retry attempts: {this.state.retryCount}/3
              </p>
            )}

            {/* Support Information */}
            <div className={`mt-6 pt-4 border-t ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}>
              <p className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                If this problem persists, please contact{" "}
                <button 
                  onClick={() => window.open('/support', '_blank')}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  technical support
                </button>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DashboardErrorBoundary;
