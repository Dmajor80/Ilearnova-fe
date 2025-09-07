import React from "react";
import { AlertTriangle, RefreshCw, Home, GraduationCap } from "lucide-react";
import { logError } from "@/lib/errorHandler";

/**
 * Enhanced error boundary specifically for school admin components.
 * Provides school-specific error handling and recovery options.
 */
class SchoolErrorBoundary extends React.Component {
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
      component: "SchoolAdmin",
      errorInfo,
      timestamp: new Date().toISOString(),
      school: this.props.schoolName || "Unknown School"
    });

    // Determine error type for better UX
    let errorType = "unknown";
    if (error.message?.includes("fetch") || error.message?.includes("network")) {
      errorType = "network";
    } else if (error.message?.includes("auth") || error.message?.includes("unauthorized")) {
      errorType = "auth";
    } else if (error.message?.includes("data") || error.message?.includes("parse")) {
      errorType = "data";
    } else if (error.message?.includes("student") || error.message?.includes("teacher")) {
      errorType = "school_data";
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

  handleGoToDashboard = () => {
    window.location.href = '/school-admin';
  };

  handleRefreshPage = () => {
    window.location.reload();
  };

  getErrorContent() {
    const { errorType } = this.state;
    const schoolName = this.props.schoolName || "School";
    
    switch (errorType) {
      case "network":
        return {
          title: "Connection Problem",
          message: `Unable to connect to ${schoolName}'s server. Please check your internet connection and try again.`,
          icon: <AlertTriangle className="w-8 h-8 text-orange-600" />,
          actions: [
            { label: "Retry", action: this.handleRetry, primary: true },
            { label: "Refresh Page", action: this.handleRefreshPage }
          ]
        };
      
      case "auth":
        return {
          title: "Authentication Error",
          message: "Your school admin session may have expired. Please refresh the page or log in again.",
          icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
          actions: [
            { label: "Refresh Page", action: this.handleRefreshPage, primary: true },
            { label: "Go to Login", action: () => window.location.href = '/login' }
          ]
        };
      
      case "school_data":
        return {
          title: "School Data Error",
          message: `There was a problem loading ${schoolName}'s data. This might be a temporary issue with student or teacher information.`,
          icon: <GraduationCap className="w-8 h-8 text-blue-600" />,
          actions: [
            { label: "Retry", action: this.handleRetry, primary: true },
            { label: "Go to Dashboard", action: this.handleGoToDashboard }
          ]
        };
      
      case "data":
        return {
          title: "Data Loading Error",
          message: `There was a problem loading ${schoolName}'s dashboard data. This might be a temporary issue.`,
          icon: <GraduationCap className="w-8 h-8 text-blue-600" />,
          actions: [
            { label: "Retry", action: this.handleRetry, primary: true },
            { label: "Go to Dashboard", action: this.handleGoToDashboard }
          ]
        };
      
      default:
        return {
          title: "Something Went Wrong",
          message: `An unexpected error occurred in ${schoolName}'s admin panel. Our team has been notified.`,
          icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
          actions: [
            { label: "Try Again", action: this.handleRetry, primary: true },
            { label: "Refresh Page", action: this.handleRefreshPage },
            { label: "Go to Dashboard", action: this.handleGoToDashboard }
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
      const schoolName = this.props.schoolName || "School";

      return (
        <div className={`min-h-screen flex items-center justify-center p-6 ${
          isDark 
            ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black" 
            : "bg-gradient-to-br from-purple-50 via-white to-blue-50"
        }`}>
          <div className={`max-w-lg w-full rounded-2xl p-8 shadow-xl text-center ${
            isDark 
              ? "bg-gray-900/60 border border-gray-700 text-gray-100" 
              : "bg-white border border-gray-200 text-gray-800"
          }`}>
            {/* School Header */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-[#4D44B5] rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">
                  {schoolName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900 text-lg">{schoolName}</h3>
                <p className="text-gray-500 text-sm">Admin Panel</p>
              </div>
            </div>

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
                      ? "bg-[#4D44B5] hover:bg-[#3D34A5] text-white"
                      : isDark
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                  disabled={action.label === "Try Again" && this.state.retryCount >= 3}
                >
                  {action.label === "Try Again" && <RefreshCw className="w-4 h-4" />}
                  {action.label === "Go to Dashboard" && <Home className="w-4 h-4" />}
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
                  className="text-[#4D44B5] hover:text-[#3D34A5] underline"
                >
                  school technical support
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

export default SchoolErrorBoundary;
