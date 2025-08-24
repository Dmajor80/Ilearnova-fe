import React, { useCallback, useEffect, useRef, useState } from "react";
import { http } from "@/api/baseClient";
import useNotification from "@/hooks/useNotification";
import usePrefersDarkMode from "@/hooks/usePrefersDarkMode";

/**
 * Hook that encapsulates signup form state, validation, notifications, and submit logic.
 * Returns UI-related flags for showing the verification screen.
 */
export default function useSignup() {
  const darkMode = usePrefersDarkMode();
  const notification = useNotification("success");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const inputRefs = useRef({});
  useEffect(() => {
    // Ensure refs for all current keys
    Object.keys(formData).forEach((key) => {
      if (!inputRefs.current[key]) {
        inputRefs.current[key] = React.createRef();
      }
    });
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target || {};
    if (!name) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.username || !formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = "Confirm your password";
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const submitSignup = useCallback(async (userData) => {
    return await http.post("/api/auth/register/", {
      body: userData,
      auth: false,
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const apiData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      await submitSignup(apiData);

      setUserEmail(formData.email);
      setShowEmailVerification(true);
      notification.notify("Registration successful! Please verify your email.", "success", 5000);
    } catch (error) {
      let type = "error";
      let message = error?.message || "Registration failed";

      const lc = String(message).toLowerCase();
      if (lc.includes("user with this email already exists")) {
        type = "info";
        message = "An account with this email already exists. Please try logging in instead.";
      } else if (lc.includes("already exists") || lc.includes("already registered")) {
        type = "info";
        message = "You are already registered! Please login instead.";
      }

      notification.notify(message, type, 6000);
      setErrors({ general: error?.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  }, [formData, notification, submitSignup, validateForm]);

  return {
    // state
    formData,
    loading,
    errors,
    showEmailVerification,
    userEmail,
    darkMode,

    // refs
    inputRefs,

    // actions
    handleChange,
    handleSubmit,
    setShowEmailVerification,

    // notifications
    notification,
  };
}
