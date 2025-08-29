import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

/**
 * Error Boundary component that catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and potentially to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      // Default fallback UI
      const isDark = typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      return (
        <div className={`min-h-screen flex items-center justify-center p-6 ${
          isDark 
            ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black" 
            : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
        }`}>
          <div className={`max-w-md w-full rounded-2xl p-8 shadow-xl text-center ${
            isDark 
              ? "bg-gray-900/60 border border-gray-700 text-gray-100" 
              : "bg-white border border-gray-200 text-gray-800"
          }`}>
            <div className="flex justify-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isDark ? "bg-red-900/30" : "bg-red-100"
              }`}>
                <AlertTriangle className={`w-8 h-8 ${
                  isDark ? "text-red-400" : "text-red-600"
                }`} />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">
              {this.props.title || "Something went wrong"}
            </h2>
            
            <p className={`mb-6 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}>
              {this.props.message || 
                "We encountered an unexpected error. Please try again or contact support if the problem persists."
              }
            </p>

            {/* Error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={`mb-6 text-left p-4 rounded-lg ${
                isDark ? "bg-gray-800/50" : "bg-gray-50"
              }`}>
                <summary className="cursor-pointer font-medium mb-2">
                  Error Details (Development)
                </summary>
                <pre className={`text-xs overflow-auto ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRetry}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isDark
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
                disabled={this.state.retryCount >= 3}
              >
                <RefreshCw className="w-4 h-4" />
                {this.state.retryCount >= 3 ? "Max Retries" : "Try Again"}
              </button>
              
              <button
                onClick={this.handleGoHome}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>

            {this.state.retryCount > 0 && (
              <p className={`mt-4 text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                Retry attempts: {this.state.retryCount}/3
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook version for functional components
 */
export function useErrorHandler() {
  const [error, setError] = React.useState(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error) => {
    console.error('Error captured:', error);
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}

export default ErrorBoundary;
