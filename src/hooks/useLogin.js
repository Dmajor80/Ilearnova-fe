import React, { useCallback, useEffect, useRef, useState } from "react";
import { http } from "@/api/baseClient";
import { setTokens } from "@/api/auth";
import useNotification from "@/hooks/useNotification";
import usePrefersDarkMode from "@/hooks/usePrefersDarkMode";

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

  const inputRefs = useRef({
    username: React.createRef(),
    password: React.createRef(),
  });

  const notification = useNotification("success");

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

  const handleInputChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

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

  const submitLogin = useCallback(async (userData) => {
    return await http.post("/api/auth/login/", {
      body: userData,
      auth: false,
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    if (e?.preventDefault) e.preventDefault();

    if (loginAttempts >= 3) {
      notification.notify(
        "Too many failed attempts. Please wait before trying again.",
        "error",
        5000
      );
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
      const access = response.access || response.token || response.access_token;
      const refresh = response.refresh;
      setTokens({ access, refresh }, storage);

      if (response.user) {
        storage?.setItem("user_data", JSON.stringify(response.user));
        if (response.user.username || response.user.email) {
          storage?.setItem(
            "prefill_username",
            response.user.username || response.user.email
          );
        }
      }

      setLoginAttempts(0);
      notification.notify("Login successful!", "success", 3000);

      if (typeof onSuccess === "function") {
        onSuccess(response);
      }
    } catch (error) {
      setLoginAttempts((prev) => prev + 1);
      let message = error?.message || "Login failed";

      const lc = String(message).toLowerCase();
      let type = "error";
      if (
        lc.includes("invalid credentials") ||
        lc.includes("incorrect password") ||
        lc.includes("user not found")
      ) {
        message =
          "Invalid username or password. Please check your credentials and try again.";
      } else if (lc.includes("account not verified")) {
        type = "info";
        message = "Please verify your email address before logging in.";
      } else if (lc.includes("account disabled")) {
        message = "Your account has been disabled. Please contact support.";
      }

      notification.notify(message, type, 5000);
      setErrors({ general: error?.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  }, [formData, loginAttempts, notification, onSuccess, rememberMe, submitLogin, validateForm]);

  return {
    // state
    formData,
    rememberMe,
    loading,
    errors,
    loginAttempts,
    darkMode,

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
