import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Hook for managing multiple loading states with debouncing and timeout handling.
 * Provides consistent loading state management across dashboard components.
 */
export default function useLoadingStates(initialStates = {}) {
  const [loadingStates, setLoadingStates] = useState(initialStates);
  const timeoutsRef = useRef({});
  const debouncersRef = useRef({});

  /**
   * Set a loading state for a specific key
   */
  const setLoading = useCallback((key, isLoading, options = {}) => {
    const { 
      debounce = 0, 
      timeout = 30000, // 30 seconds default timeout
      onTimeout 
    } = options;

    // Clear existing debouncer
    if (debouncersRef.current[key]) {
      clearTimeout(debouncersRef.current[key]);
    }

    // Clear existing timeout
    if (timeoutsRef.current[key]) {
      clearTimeout(timeoutsRef.current[key]);
      delete timeoutsRef.current[key];
    }

    const updateState = () => {
      setLoadingStates(prev => ({
        ...prev,
        [key]: isLoading
      }));

      // Set timeout for loading state if it's being set to true
      if (isLoading && timeout > 0) {
        timeoutsRef.current[key] = setTimeout(() => {
          setLoadingStates(prev => ({
            ...prev,
            [key]: false
          }));
          
          if (onTimeout) {
            onTimeout(key);
          }
          
          delete timeoutsRef.current[key];
        }, timeout);
      }
    };

    if (debounce > 0) {
      debouncersRef.current[key] = setTimeout(updateState, debounce);
    } else {
      updateState();
    }
  }, []);

  /**
   * Get loading state for a specific key
   */
  const isLoading = useCallback((key) => {
    return Boolean(loadingStates[key]);
  }, [loadingStates]);

  /**
   * Check if any loading state is active
   */
  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  /**
   * Clear all loading states
   */
  const clearAllLoading = useCallback(() => {
    // Clear all timeouts
    Object.values(timeoutsRef.current).forEach(clearTimeout);
    timeoutsRef.current = {};

    // Clear all debouncers
    Object.values(debouncersRef.current).forEach(clearTimeout);
    debouncersRef.current = {};

    setLoadingStates({});
  }, []);

  /**
   * Clear specific loading state
   */
  const clearLoading = useCallback((key) => {
    if (timeoutsRef.current[key]) {
      clearTimeout(timeoutsRef.current[key]);
      delete timeoutsRef.current[key];
    }

    if (debouncersRef.current[key]) {
      clearTimeout(debouncersRef.current[key]);
      delete debouncersRef.current[key];
    }

    setLoadingStates(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  }, []);

  /**
   * Wrap an async function with loading state management
   */
  const withLoading = useCallback((key, asyncFn, options = {}) => {
    return async (...args) => {
      setLoading(key, true, options);
      try {
        const result = await asyncFn(...args);
        setLoading(key, false);
        return result;
      } catch (error) {
        setLoading(key, false);
        throw error;
      }
    };
  }, [setLoading]);

  /**
   * Create a loading wrapper for multiple operations
   */
  const createLoadingGroup = useCallback((groupKey) => {
    const operations = new Set();
    
    const addOperation = (operationKey) => {
      operations.add(operationKey);
      updateGroupState();
    };

    const removeOperation = (operationKey) => {
      operations.delete(operationKey);
      updateGroupState();
    };

    const updateGroupState = () => {
      setLoading(groupKey, operations.size > 0);
    };

    return {
      addOperation,
      removeOperation,
      isGroupLoading: () => isLoading(groupKey),
      clearGroup: () => {
        operations.clear();
        updateGroupState();
      }
    };
  }, [setLoading, isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutsRef.current).forEach(clearTimeout);
      Object.values(debouncersRef.current).forEach(clearTimeout);
    };
  }, []);

  return {
    // State
    loadingStates,
    
    // Actions
    setLoading,
    clearLoading,
    clearAllLoading,
    
    // Queries
    isLoading,
    isAnyLoading,
    
    // Utilities
    withLoading,
    createLoadingGroup
  };
}

/**
 * Hook for managing loading states with automatic error handling
 */
export function useAsyncOperation(options = {}) {
  const { 
    onError, 
    onSuccess, 
    timeout = 30000,
    retryCount = 0 
  } = options;

  const [state, setState] = useState({
    loading: false,
    error: null,
    data: null,
    retryAttempts: 0
  });

  const execute = useCallback(async (asyncFn, ...args) => {
    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null 
    }));

    let timeoutId;
    
    try {
      // Set up timeout
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`Operation timed out after ${timeout}ms`));
        }, timeout);
      });

      // Race between the async operation and timeout
      const result = await Promise.race([
        asyncFn(...args),
        timeoutPromise
      ]);

      clearTimeout(timeoutId);

      setState(prev => ({ 
        ...prev, 
        loading: false, 
        data: result,
        retryAttempts: 0
      }));

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error) {
      clearTimeout(timeoutId);

      setState(prev => {
        const newState = { 
          ...prev, 
          loading: false, 
          error: error.message || 'An error occurred'
        };

        // Auto-retry logic
        if (prev.retryAttempts < retryCount) {
          newState.retryAttempts = prev.retryAttempts + 1;
          // Retry after a delay
          setTimeout(() => {
            execute(asyncFn, ...args);
          }, Math.pow(2, prev.retryAttempts) * 1000); // Exponential backoff
        }

        return newState;
      });

      if (onError) {
        onError(error);
      }

      throw error;
    }
  }, [timeout, retryCount, onError, onSuccess]);

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      data: null,
      retryAttempts: 0
    });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
}
