import React, { useCallback, useEffect, useRef, useState } from "react";
import { http } from "@/api/baseClient";
import { setTokens } from "@/api/auth";
import useNotification from "@/hooks/useNotification";
import usePrefersDarkMode from "@/hooks/usePrefersDarkMode";
import { parseError, getUserFriendlyMessage, getNotificationType, withRetry } from "@/lib/errorHandler";

/**
 * Hook that encapsulates login form state, validation, notifications, and submit logic.
 * Pass an onSuccess callback to handle navigation after successful login.
 */
export default function useLogin({ onSuccess } = {}) {
  const darkMode = usePrefersDarkMode();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  const inputRefs = useRef({
    username: React.createRef(),
    password: React.createRef(),
  });

  // Security constants
  const MAX_LOGIN_ATTEMPTS = 5; // lock on 5th failed attempt
  const BLOCK_DURATION_MS = 5 * 60 * 1000; // 15 minutes
  const ATTEMPT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

  const notification = useNotification("success");

  // Storage key factory
  const getStorageKey = useCallback(
    (type) => {
      return `login_${type}_${formData.username || "anonymous"}`;
    },
    [formData.username]
  );

  /**
   * Clear all rate-limit state for current username:
   * - attempts list
   * - block timestamp
   * - local UI state
   */
  const clearFailedAttempts = useCallback(() => {
    if (!formData.username) return;

    const attemptsKey = getStorageKey("attempts");
    const blockKey = getStorageKey("blocked_until");

    localStorage.removeItem(attemptsKey);
    localStorage.removeItem(blockKey);
    setLoginAttempts(0);
    setIsBlocked(false);
    setBlockTimeRemaining(0);
  }, [formData.username, getStorageKey]);

  /**
   * Check if login is allowed right now.
   * - If a block is active and not expired, disallow and show remaining time
   * - If a previous block has expired, reset attempts and block automatically
   * - If attempts exceed the threshold within the window, initiate a new block
   */
  const checkRateLimit = useCallback(() => {
    if (!formData.username) return { allowed: true };

    const attemptsKey = getStorageKey("attempts");
    const blockKey = getStorageKey("blocked_until");

    const now = Date.now();
    const blockedUntil = parseInt(localStorage.getItem(blockKey) || "0", 10);

    // If block expired, reset state and storage immediately
    if (blockedUntil && blockedUntil <= now) {
      clearFailedAttempts();
    }

    // If still blocked, return remaining time
    if (blockedUntil > now) {
      const remaining = Math.ceil((blockedUntil - now) / 1000);
      setBlockTimeRemaining(remaining);
      setIsBlocked(true);
      return {
        allowed: false,
        reason: `Account temporarily locked. Try again in ${Math.ceil(remaining / 60)} minutes.`,
      };
    }

    // Check attempt count within window
    const attemptsData = JSON.parse(localStorage.getItem(attemptsKey) || "[]");
    const windowStart = now - ATTEMPT_WINDOW_MS;
    const recentAttempts = attemptsData.filter((timestamp) => timestamp > windowStart);

    // sync UI counter
    setLoginAttempts(recentAttempts.length);

    // Exceeded threshold => create a new block and disallow
    if (recentAttempts.length >= MAX_LOGIN_ATTEMPTS) {
      const newBlockedUntil = now + BLOCK_DURATION_MS;
      localStorage.setItem(blockKey, newBlockedUntil.toString());
      setIsBlocked(true);
      setBlockTimeRemaining(Math.ceil(BLOCK_DURATION_MS / 1000));
      return {
        allowed: false,
        reason: `Too many failed attempts. Account locked for ${BLOCK_DURATION_MS / 60000} minutes.`,
      };
    }

    setIsBlocked(false);
    setBlockTimeRemaining(0);
    return { allowed: true, recentAttempts: recentAttempts.length };
  }, [
    formData.username,
    getStorageKey,
    MAX_LOGIN_ATTEMPTS,
    ATTEMPT_WINDOW_MS,
    BLOCK_DURATION_MS,
    clearFailedAttempts,
  ]);

  /**
   * Record a failed attempt, only keeping those within the ATTEMPT_WINDOW_MS window.
   */
  const recordFailedAttempt = useCallback(() => {
    if (!formData.username) return;

    const attemptsKey = getStorageKey("attempts");
    const now = Date.now();
    const windowStart = now - ATTEMPT_WINDOW_MS;

    const attemptsData = JSON.parse(localStorage.getItem(attemptsKey) || "[]");
    const recentAttempts = attemptsData.filter((timestamp) => timestamp > windowStart);
    recentAttempts.push(now);

    localStorage.setItem(attemptsKey, JSON.stringify(recentAttempts));
    setLoginAttempts(recentAttempts.length);
  }, [formData.username, getStorageKey, ATTEMPT_WINDOW_MS]);

  /**
   * On mount/username change:
   * - Sync UI with storage (remaining block time, attempts)
   * - If a stored block is expired, clear it and reset attempts
   */
  useEffect(() => {
    if (!formData.username) return;

    const attemptsKey = getStorageKey("attempts");
    const blockKey = getStorageKey("blocked_until");
    const now = Date.now();
    const blockedUntil = parseInt(localStorage.getItem(blockKey) || "0", 10);

    if (blockedUntil > now) {
      setIsBlocked(true);
      setBlockTimeRemaining(Math.ceil((blockedUntil - now) / 1000));
    } else if (blockedUntil) {
      // expired block
      clearFailedAttempts();
    }

    const attemptsData = JSON.parse(localStorage.getItem(attemptsKey) || "[]");
    const windowStart = now - ATTEMPT_WINDOW_MS;
    const recentAttempts = attemptsData.filter((timestamp) => timestamp > windowStart);
    setLoginAttempts(recentAttempts.length);
  }, [formData.username, getStorageKey, ATTEMPT_WINDOW_MS, clearFailedAttempts]);

  /**
   * Block countdown timer:
   * - Recomputes remaining time from storage each second
   * - Auto-unlocks and resets attempts when countdown reaches zero
   */
  useEffect(() => {
    if (!isBlocked) return;

    const interval = setInterval(() => {
      const blockKey = getStorageKey("blocked_until");
      const now = Date.now();
      const blockedUntil = parseInt(localStorage.getItem(blockKey) || "0", 10);
      const remaining = Math.ceil((blockedUntil - now) / 1000);

      if (blockedUntil > now && remaining > 0) {
        setBlockTimeRemaining(remaining);
      } else {
        // unlock
        clearFailedAttempts();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isBlocked, getStorageKey, clearFailedAttempts]);

  // Focus username on mount
  useEffect(() => {
    const id = setTimeout(() => inputRefs.current.username?.current?.focus(), 100);
    return () => clearTimeout(id);
  }, []);

  // Prefill username from storage
  useEffect(() => {
    try {
      const prefill =
        sessionStorage.getItem("prefill_username") ||
        localStorage.getItem("prefill_username");
      if (prefill) {
        setFormData((prev) => ({ ...prev, username: prefill }));
      }
    } catch {}
  }, []);

  const handleInputChange = useCallback(
    (name, value) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const submitLogin = useCallback(
    withRetry(async (userData) => {
      return await http.post("/api/auth/login/", {
        body: userData,
        auth: false,
      });
    }, 2, 1000), // Max 2 retries with 1 second base delay
    []
  );

  const handleSubmit = useCallback(
    async (e) => {
      if (e?.preventDefault) e.preventDefault();

      // Check rate limiting
      const rateLimitCheck = checkRateLimit();
      if (!rateLimitCheck.allowed) {
        notification.notify(rateLimitCheck.reason, "error", 8000);
        return;
      }

      if (!validateForm()) return;

      setLoading(true);
      setErrors({});

      try {
        const loginData = {
          username: formData.username,
          password: formData.password,
        };

        const response = await submitLogin(loginData);

        // Store tokens and user
        const storage = rememberMe ? window.localStorage : window.sessionStorage;
        const access = response.data?.token || response.access || response.token || response.access_token;
        const refresh = response.data?.refresh_token || response.refresh;
        setTokens({ access, refresh }, storage);

        console.log("useLogin: Login response:", response);
        console.log("useLogin: User data from response:", response.data?.user);

        if (response.data?.user) {
          console.log("useLogin: Storing user data in storage:", response.data.user);
          storage?.setItem("user_data", JSON.stringify(response.data.user));
          if (response.data.user.username || response.data.user.email) {
            storage?.setItem(
              "prefill_username",
              response.data.user.username || response.data.user.email
            );
          }
        } else {
          console.warn("useLogin: No user data in login response!");
        }

        clearFailedAttempts();
        notification.notify("Login successful!", "success", 3000);

        if (typeof onSuccess === "function") {
          onSuccess(response);
        }
      } catch (error) {
        recordFailedAttempt();

        // Use enhanced error handling
        const appError = parseError(error, {
          action: "login",
          username: formData.username,
        });
        const userMessage = getUserFriendlyMessage(appError);
        const notificationType = getNotificationType(appError);

        // Check if this failure triggered a block
        const rateLimitAfter = checkRateLimit();
        const finalMessage = !rateLimitAfter.allowed
          ? rateLimitAfter.reason
          : userMessage;
        const finalType = !rateLimitAfter.allowed ? "error" : notificationType;

        notification.notify(finalMessage, finalType, 8000);
        setErrors({ general: userMessage });
      } finally {
        setLoading(false);
      }
    },
    [
      formData,
      rememberMe,
      submitLogin,
      validateForm,
      notification,
      onSuccess,
      checkRateLimit,
      clearFailedAttempts,
      recordFailedAttempt,
    ]
  );

  return {
    // state
    formData,
    rememberMe,
    loading,
    errors,
    loginAttempts,
    darkMode,
    isBlocked,
    blockTimeRemaining,

    // refs
    inputRefs,

    // actions
    handleInputChange,
    setRememberMe,
    handleSubmit,

    // notifications
    notification,
  };
}
