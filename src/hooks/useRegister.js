import { useCallback, useState } from "react";
import * as authApi from "@/api/authApi";
import { persistAuthResponse } from "@/api/auth";
import useNotification from "@/hooks/useNotification";
import usePrefersDarkMode from "@/hooks/usePrefersDarkMode";
import { parseError, getUserFriendlyMessage, getNotificationType } from "@/lib/errorHandler";
import { useNavigate } from "react-router-dom";

/**
 * Hook that encapsulates registration form state, validation, notifications, and submit logic.
 * Pass an onSuccess callback to handle navigation after successful registration.
 * `initial` pre-fills fields. Schools register elsewhere
 * (features/auth/RegisterSchool), so there is no org admin role here.
 */
export default function useRegister({ onSuccess, initial } = {}) {
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
    student_id: "",
    parent_email: "",
    id_document: null,
    ...(initial || {}),
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
    if (formData.role === "super_admin") {
      if (!formData.organization_name.trim()) {
        newErrors.organization_name = "Organization name is required";
      }
    }

    if (["teacher", "student", "parent"].includes(formData.role)) {
      if (!formData.organization_id) {
        newErrors.organization_id = "Please select an organization";
      }
    }
    if (formData.role === "student") {
      if (!formData.student_id.trim()) newErrors.student_id = "Student ID is required";
      if (!formData.parent_email.trim()) {
        newErrors.parent_email = "Parent email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.parent_email)) {
        newErrors.parent_email = "Please enter a valid parent email";
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
          organization_code: formData.organization_id,
          date_of_birth: formData.date_of_birth || undefined,
          additional_data:{}
        };
        if (formData.role === "student") {
          registrationData.student_id = formData.student_id;
          registrationData.parent_email = formData.parent_email;
        }
      } else {
        registrationData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          date_of_birth: formData.date_of_birth || undefined,
          phone_number: formData.phone || undefined,
          bio:"",
          address:"",
          additional_data:{}
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
            if (formData.role === "super_admin") {
              registrationData.organization_name = formData.organization_name;
            }
            if (["teacher", "student", "parent"].includes(formData.role)) {
              registrationData.organization_id = formData.organization_id;
            }
            response = await authApi.register(registrationData);
        }

        persistAuthResponse(response, window.localStorage);
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

        // Show the backend's per-field reasons (e.g. "This access code was
        // issued to a different email address.") next to the fields.
        const fieldErrors = error?.data?.field_errors || {};
        const byField = Object.fromEntries(
          Object.entries(fieldErrors).map(([field, list]) => [
            field,
            String(Array.isArray(list) ? list[0] : list),
          ])
        );
        const general = userMessage;

        notification.notify(general, notificationType, 8000);
        setErrors({ ...byField, general });
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
