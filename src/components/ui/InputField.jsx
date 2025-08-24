import React, { useState } from "react";

/**
 * Reusable input field with optional icon and password toggle.
 * Expects handleChange(name, value) signature from parent.
 */
export default React.memo(function InputField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  nextField,
  icon: Icon,
  darkMode,
  errors = {},
  formData = {},
  inputRefs,
  handleChange,
  handleSubmit,
  showToggle = false,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = showToggle || type === "password";

  return (
    <div className="mb-6 group">
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-semibold mb-3 transition-colors ${
            darkMode
              ? "text-gray-200 group-focus-within:text-blue-400"
              : "text-gray-700 group-focus-within:text-blue-600"
          }`}
        >
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <Icon
              className={`w-5 h-5 transition-colors ${
                darkMode
                  ? "text-gray-400 group-focus-within:text-blue-400"
                  : "text-gray-500 group-focus-within:text-blue-600"
              }`}
            />
          </div>
        )}
        <input
          ref={inputRefs?.current?.[name]}
          id={name}
          name={name}
          type={isPassword && showPassword ? "text" : type}
          value={formData?.[name] ?? ""}
          placeholder={placeholder}
          onChange={(e) => {
            if (!handleChange) return;
            // Support either signature:
            // 1) handleChange(name, value)
            // 2) handleChange(event) where event.target = { name, value }
            if (handleChange.length >= 2) {
              handleChange(name, e.target.value);
            } else {
              handleChange({ target: { name, value: e.target.value } });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (nextField && inputRefs?.current?.[nextField]) {
                inputRefs.current[nextField].current?.focus();
              } else {
                handleSubmit?.(e);
              }
            }
          }}
          className={`w-full ${Icon ? "pl-12" : "pl-4"} ${
            isPassword ? "pr-12" : "pr-4"
          } py-4 rounded-2xl border-2 text-sm font-medium transition-all duration-300 ease-in-out outline-none ${
            darkMode
              ? "bg-gray-800/50 text-white border-gray-600 placeholder-gray-400 focus:bg-gray-800 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20"
              : "bg-white text-gray-800 border-gray-200 placeholder-gray-500 focus:bg-blue-50/30 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20"
          } ${errors?.[name] ? "border-red-400 bg-red-50/30" : ""} hover:border-gray-400`}
          aria-invalid={errors?.[name] ? "true" : "false"}
          aria-describedby={errors?.[name] ? `${name}-error` : undefined}
          disabled={disabled}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-1 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} fill="none" stroke="currentColor"><path d="M2 2l20 20"/><path d="M10.58 10.58a2 2 0 0 0 2.83 2.83"/><path d="M16.68 16.68A9.39 9.39 0 0 1 12 18c-5 0-9-4-9-6a9.86 9.86 0 0 1 5.13-4.87"/><path d="M13.12 6.13A9.87 9.87 0 0 1 21 12c0 2-4 6-9 6a9.39 9.39 0 0 1-4.6-1.32"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} fill="none" stroke="currentColor"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        )}
      </div>
      {errors?.[name] && (
        <p
          id={`${name}-error`}
          className="text-red-500 text-xs mt-2 flex items-center"
          role="alert"
        >
          {errors[name]}
        </p>
      )}
    </div>
  );
});
