import { useCallback, useState } from "react";
import * as authApi from "@/api/authApi";
import { setTokens } from "@/api/auth";
import useNotification from "@/hooks/useNotification";
import usePrefersDarkMode from "@/hooks/usePrefersDarkMode";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";
import { useNavigate } from "react-router-dom";

/**
 * Hook that encapsulates registration form state, validation, notifications, and submit logic.
 * Pass an onSuccess callback to handle navigation after successful registration.
 */
export default function useRegister({ onSuccess } = {}) {
  const navigate = useNavigate();
  const darkMode = usePrefersDarkMode();
  const notification = useNotification("success");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    date_of_birth:"",
    phone: "",
    role: "individual_learner",
    organization_name: "",
    organization_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

    // Common validations
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    // Role-specific validations
    if (["super_admin", "org_admin"].includes(formData.role)) {
      if (!formData.organization_name.trim()) {
        newErrors.organization_name = "Organization name is required";
      }
    }

    if (["teacher", "student", "parent"].includes(formData.role)) {
      if (!formData.organization_id) {
        newErrors.organization_id = "Please select an organization";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e?.preventDefault) e.preventDefault();

      if (!validateForm()) return;

      setLoading(true);
      setErrors({});

      let registrationData

      // Prepare registration data based on role
      try {
        if (["parent","student","teacher"].includes(formData.role) ){
          registrationData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone_number: formData.phone || undefined,
          organization_code:formData.organization_id,
          bio:"string",
          date_of_birth: formData.date_of_birth,
          address:"string",
          additional_data:"string"
        };
      } else {
        registrationData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          date_of_birth: formData.date_of_birth,
          phone_number: formData.phone || undefined,
          bio:"string",
          date_of_birth: "2026-01-01",
          address:"string",
          additional_data:"string"
        };
        }
        
        console.log(registrationData)

        let response;
        // Call specific registration endpoint based on role
        switch (formData.role) {
          case "super_admin":
            registrationData.organization_name = formData.organization_name;
            response = await authApi.registerSuperAdmin(registrationData);
            break;
          case "org_admin":
            registrationData.organization_name = formData.organization_name;
            response = await authApi.registerOrgAdmin(registrationData);
            break;
          case "teacher":
            // registrationData.organization_id = formData.organization_id;
            response = await authApi.registerTeacher(registrationData);
            break;
          case "student":
            // registrationData.organization_id = formData.organization_id;
            response = await authApi.registerStudent(registrationData);
            break;
          case "parent":
            // registrationData.organization_id = formData.organization_id;
            response = await authApi.registerParent(registrationData);
            break;
          case "individual_learner":
            response = await authApi.registerIndividualLearner(registrationData);
            break;
          default:

            // Fallback to general register for any other roles
            registrationData.role = formData.role;
            if (["super_admin", "org_admin"].includes(formData.role)) {
              registrationData.organization_name = formData.organization_name;
            }
            if (["teacher", "student", "parent"].includes(formData.role)) {
              registrationData.organization_id = formData.organization_id;
            }
            response = await authApi.register(registrationData);
        }

        // Store tokens if provided (for immediate login)
        const access = response.data?.token || response.token || response.access || response.access_token;
        if (access) {
          const storage = window.localStorage; // Always use localStorage for new registrations
          setTokens({ access, refresh: null }, storage);

          const user = response.data?.user || response.user;
          if (user) {
            storage.setItem("user_data", JSON.stringify(user));
          }
        }
        notification.notify("Registration successful!", "success", 3000);

        if (typeof onSuccess === "function") {
          onSuccess(response);
        }
      } catch (error) {
        const appError = parseError(error, {
          action: "register",
          email: formData.email,
        });
        const userMessage = getUserFriendlyMessage(appError);
        const notificationType = getNotificationType(appError);

        notification.notify(userMessage, notificationType, 8000);
        setErrors({ general: userMessage });
      } finally {
        setLoading(false);
      }
    },
    [formData, validateForm, notification, onSuccess]
  );

  return {
    formData,
    loading,
    errors,
    darkMode,
    handleInputChange,
    handleSubmit,
    notification,
  };
}
