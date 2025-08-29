/**
 * Centralized error handling utilities for the application
 */

// Error types for better categorization
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  AUTHORIZATION: 'AUTHZ_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  SERVER: 'SERVER_ERROR',
  CLIENT: 'CLIENT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Enhanced error class with additional context
 */
export class AppError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, severity = ERROR_SEVERITY.MEDIUM, context = {}) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.context = context;
    this.timestamp = new Date().toISOString();
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      severity: this.severity,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

/**
 * Parse and categorize errors from different sources
 */
export function parseError(error, context = {}) {
  if (error instanceof AppError) {
    return error;
  }

  let type = ERROR_TYPES.UNKNOWN;
  let severity = ERROR_SEVERITY.MEDIUM;
  let message = error?.message || 'An unexpected error occurred';

  // Network errors
  if (error?.name === 'TypeError' && message.includes('fetch')) {
    type = ERROR_TYPES.NETWORK;
    severity = ERROR_SEVERITY.HIGH;
    message = 'Network connection failed. Please check your internet connection.';
  }

  // HTTP errors
  if (error?.status) {
    const status = error.status;
    
    if (status >= 400 && status < 500) {
      type = status === 401 ? ERROR_TYPES.AUTHENTICATION : 
            status === 403 ? ERROR_TYPES.AUTHORIZATION :
            status === 422 ? ERROR_TYPES.VALIDATION :
            ERROR_TYPES.CLIENT;
      severity = status === 401 || status === 403 ? ERROR_SEVERITY.HIGH : ERROR_SEVERITY.MEDIUM;
    } else if (status >= 500) {
      type = ERROR_TYPES.SERVER;
      severity = ERROR_SEVERITY.HIGH;
      message = 'Server error. Please try again later.';
    }
  }

  // Authentication specific errors
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('invalid credentials')) {
    type = ERROR_TYPES.AUTHENTICATION;
    severity = ERROR_SEVERITY.HIGH;
  }

  return new AppError(message, type, severity, { ...context, originalError: error });
}

/**
 * Get user-friendly error messages
 */
export function getUserFriendlyMessage(error) {
  const appError = parseError(error);
  
  const messages = {
    [ERROR_TYPES.NETWORK]: 'Connection problem. Please check your internet and try again.',
    [ERROR_TYPES.AUTHENTICATION]: 'Please check your login credentials and try again.',
    [ERROR_TYPES.AUTHORIZATION]: 'You don\'t have permission to access this resource.',
    [ERROR_TYPES.VALIDATION]: 'Please check your input and try again.',
    [ERROR_TYPES.SERVER]: 'Server is temporarily unavailable. Please try again later.',
    [ERROR_TYPES.CLIENT]: 'Something went wrong. Please try again.',
    [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred. Please try again.'
  };

  return messages[appError.type] || appError.message;
}

/**
 * Get appropriate notification type for error
 */
export function getNotificationType(error) {
  const appError = parseError(error);
  
  switch (appError.severity) {
    case ERROR_SEVERITY.LOW:
      return 'info';
    case ERROR_SEVERITY.MEDIUM:
      return 'warning';
    case ERROR_SEVERITY.HIGH:
    case ERROR_SEVERITY.CRITICAL:
      return 'error';
    default:
      return 'error';
  }
}

/**
 * Determine if error should trigger a retry
 */
export function shouldRetry(error, retryCount = 0, maxRetries = 3) {
  if (retryCount >= maxRetries) return false;
  
  const appError = parseError(error);
  
  // Don't retry authentication or authorization errors
  if (appError.type === ERROR_TYPES.AUTHENTICATION || 
      appError.type === ERROR_TYPES.AUTHORIZATION) {
    return false;
  }
  
  // Don't retry validation errors
  if (appError.type === ERROR_TYPES.VALIDATION) {
    return false;
  }
  
  // Retry network and server errors
  return appError.type === ERROR_TYPES.NETWORK || 
         appError.type === ERROR_TYPES.SERVER;
}

/**
 * Get retry delay with exponential backoff
 */
export function getRetryDelay(retryCount, baseDelay = 1000) {
  return Math.min(baseDelay * Math.pow(2, retryCount), 10000); // Max 10 seconds
}

/**
 * Log error for monitoring/debugging
 */
export function logError(error, context = {}) {
  const appError = parseError(error, context);
  
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 ${appError.type} - ${appError.severity.toUpperCase()}`);
    console.error('Message:', appError.message);
    console.error('Context:', appError.context);
    console.error('Stack:', appError.stack);
    console.groupEnd();
  }
  
  // In production, you would send to error monitoring service
  // Example: Sentry, LogRocket, etc.
  if (process.env.NODE_ENV === 'production') {
    // sendToErrorService(appError);
  }
  
  return appError;
}

/**
 * Create a retry wrapper for async functions
 */
export function withRetry(fn, maxRetries = 3, baseDelay = 1000) {
  return async function(...args) {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries || !shouldRetry(error, attempt, maxRetries)) {
          throw logError(error, { attempt, maxRetries, function: fn.name });
        }
        
        const delay = getRetryDelay(attempt, baseDelay);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  };
}

/**
 * Global error handler for unhandled promise rejections
 */
export function setupGlobalErrorHandling() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason, { type: 'unhandledrejection' });
    
    // Prevent the default browser behavior
    event.preventDefault();
  });
  
  // Handle global errors
  window.addEventListener('error', (event) => {
    logError(event.error, { 
      type: 'global_error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });
}
