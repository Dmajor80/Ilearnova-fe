import { useState, useCallback } from "react";

/**
 * Unified circuit breaker hook for API error handling
 * 
 * This hook implements the circuit breaker pattern to prevent repeated calls
 * to failed API endpoints. It tracks failed endpoints and provides utilities
 * to check, mark, and reset endpoint failures.
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.maxRetries - Maximum number of retries before marking as failed (default: 3)
 * @param {number} options.retryDelay - Delay in milliseconds before allowing retry (default: 60000)
 * @param {boolean} options.autoReset - Whether to automatically reset failed endpoints after delay (default: false)
 * 
 * @returns {Object} Circuit breaker utilities and state
 */
export default function useApiCircuitBreaker(options = {}) {
  const {
    maxRetries = 3,
    retryDelay = 60000, // 1 minute
    autoReset = false
  } = options;

  // Track failed endpoints and their error details
  const [failedEndpoints, setFailedEndpoints] = useState(new Set());
  const [endpointErrors, setEndpointErrors] = useState({});
  const [endpointRetries, setEndpointRetries] = useState({});
  const [endpointFailureTimes, setEndpointFailureTimes] = useState({});

  /**
   * Check if an endpoint should be called (circuit breaker pattern)
   * 
   * @param {string} endpointName - Name of the endpoint to check
   * @returns {boolean} Whether the endpoint should be called
   */
  const shouldCallEndpoint = useCallback((endpointName) => {
    if (!failedEndpoints.has(endpointName)) {
      return true;
    }

    // If auto-reset is enabled, check if enough time has passed
    if (autoReset) {
      const failureTime = endpointFailureTimes[endpointName];
      if (failureTime && Date.now() - failureTime > retryDelay) {
        // Reset the endpoint and allow the call
        resetEndpoint(endpointName);
        return true;
      }
    }

    return false;
  }, [failedEndpoints, endpointFailureTimes, autoReset, retryDelay]);

  /**
   * Mark an endpoint as failed to prevent future calls
   * 
   * @param {string} endpointName - Name of the endpoint that failed
   * @param {string|Error} error - Error message or Error object
   * @param {Object} options - Additional options
   * @param {boolean} options.incrementRetry - Whether to increment retry count (default: true)
   */
  const markEndpointFailed = useCallback((endpointName, error, options = {}) => {
    const { incrementRetry = true } = options;

    const errorMessage = error instanceof Error ? error.message : error;
    const currentRetries = endpointRetries[endpointName] || 0;
    const newRetries = incrementRetry ? currentRetries + 1 : currentRetries;

    // Update retry count
    setEndpointRetries(prev => ({
      ...prev,
      [endpointName]: newRetries
    }));

    // Only mark as failed if we've exceeded max retries
    if (newRetries >= maxRetries) {
      setFailedEndpoints(prev => new Set([...prev, endpointName]));
      setEndpointFailureTimes(prev => ({
        ...prev,
        [endpointName]: Date.now()
      }));
    }

    // Always update the error message
    setEndpointErrors(prev => ({
      ...prev,
      [endpointName]: {
        message: errorMessage,
        retries: newRetries,
        timestamp: Date.now(),
        isFailed: newRetries >= maxRetries
      }
    }));

    console.warn(`Endpoint ${endpointName} failed (attempt ${newRetries}/${maxRetries}):`, errorMessage);
  }, [endpointRetries, maxRetries]);

  /**
   * Reset a specific failed endpoint
   * 
   * @param {string} endpointName - Name of the endpoint to reset
   */
  const resetEndpoint = useCallback((endpointName) => {
    setFailedEndpoints(prev => {
      const newSet = new Set(prev);
      newSet.delete(endpointName);
      return newSet;
    });

    setEndpointErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[endpointName];
      return newErrors;
    });

    setEndpointRetries(prev => {
      const newRetries = { ...prev };
      delete newRetries[endpointName];
      return newRetries;
    });

    setEndpointFailureTimes(prev => {
      const newTimes = { ...prev };
      delete newTimes[endpointName];
      return newTimes;
    });

    console.log(`Reset circuit breaker for endpoint: ${endpointName}`);
  }, []);

  /**
   * Reset all failed endpoints (for manual retry)
   */
  const resetAllEndpoints = useCallback(() => {
    setFailedEndpoints(new Set());
    setEndpointErrors({});
    setEndpointRetries({});
    setEndpointFailureTimes({});
    console.log("Reset all circuit breakers");
  }, []);

  /**
   * Get the status of a specific endpoint
   * 
   * @param {string} endpointName - Name of the endpoint
   * @returns {Object} Endpoint status information
   */
  const getEndpointStatus = useCallback((endpointName) => {
    const isFailed = failedEndpoints.has(endpointName);
    const error = endpointErrors[endpointName];
    const retries = endpointRetries[endpointName] || 0;
    const failureTime = endpointFailureTimes[endpointName];

    return {
      isFailed,
      canCall: shouldCallEndpoint(endpointName),
      error: error?.message,
      retries,
      maxRetries,
      failureTime,
      timeSinceFailure: failureTime ? Date.now() - failureTime : null
    };
  }, [failedEndpoints, endpointErrors, endpointRetries, endpointFailureTimes, shouldCallEndpoint, maxRetries]);

  /**
   * Get all endpoint statuses
   * 
   * @returns {Object} All endpoint statuses keyed by endpoint name
   */
  const getAllEndpointStatuses = useCallback(() => {
    const allEndpoints = new Set([
      ...Object.keys(endpointErrors),
      ...Object.keys(endpointRetries),
      ...failedEndpoints
    ]);

    const statuses = {};
    allEndpoints.forEach(endpointName => {
      statuses[endpointName] = getEndpointStatus(endpointName);
    });

    return statuses;
  }, [endpointErrors, endpointRetries, failedEndpoints, getEndpointStatus]);

  /**
   * Execute an API call with circuit breaker protection
   * 
   * @param {string} endpointName - Name of the endpoint
   * @param {Function} apiCall - Function that makes the API call
   * @param {Object} options - Additional options
   * @param {boolean} options.throwOnFailure - Whether to throw error if circuit is open (default: false)
   * @returns {Promise} Result of the API call or null if circuit is open
   */
  const executeWithCircuitBreaker = useCallback(async (endpointName, apiCall, options = {}) => {
    const { throwOnFailure = false } = options;

    if (!shouldCallEndpoint(endpointName)) {
      const message = `Circuit breaker is open for endpoint: ${endpointName}`;
      console.warn(message);
      
      if (throwOnFailure) {
        throw new Error(message);
      }
      return null;
    }

    try {
      const result = await apiCall();
      
      // Reset endpoint on successful call
      if (endpointRetries[endpointName] > 0) {
        resetEndpoint(endpointName);
      }
      
      return result;
    } catch (error) {
      markEndpointFailed(endpointName, error);
      throw error;
    }
  }, [shouldCallEndpoint, endpointRetries, resetEndpoint, markEndpointFailed]);

  return {
    // State
    failedEndpoints,
    endpointErrors,
    endpointRetries,

    // Core functions
    shouldCallEndpoint,
    markEndpointFailed,
    resetEndpoint,
    resetAllEndpoints,

    // Status functions
    getEndpointStatus,
    getAllEndpointStatuses,

    // Utility functions
    executeWithCircuitBreaker,

    // Configuration
    maxRetries,
    retryDelay,
    autoReset
  };
}
