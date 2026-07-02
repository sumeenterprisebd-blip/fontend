/**
 * Form Validation Utilities
 * Provides consistent validation across all forms
 */

export const validateEmail = (email) => {
  if (!email) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return "";
};

export const normalizePhone = (phone) => {
  const digits = String(phone || "").replace(/[^\d]/g, "");
  if (!digits) return "";

  // Bangladesh canonicalization: +8801XXXXXXXXX / 8801XXXXXXXXX -> 01XXXXXXXXX
  if (digits.startsWith("8801") && digits.length === 13) {
    return `0${digits.slice(3)}`;
  }

  return digits;
};

export const validatePhone = (phone) => {
  if (!phone) {
    return "Phone number is required";
  }
  const normalized = normalizePhone(phone);
  const phoneRegex = /^01[3-9]\d{8}$/;
  if (!phoneRegex.test(normalized)) {
    return "Phone number must be 11 digits starting with 01";
  }
  return "";
};

export const validatePassword = (password) => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  return "";
};

export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return "";
};

export const validateRequired = (value, fieldName = "This field") => {
  if (!value || (typeof value === "string" && !value.trim())) {
    return `${fieldName} is required`;
  }
  return "";
};

export const validateMinLength = (
  value,
  minLength,
  fieldName = "This field"
) => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return "";
};

export const validateMaxLength = (
  value,
  maxLength,
  fieldName = "This field"
) => {
  if (value && value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return "";
};

export const validateNumber = (value, fieldName = "This field") => {
  if (value && isNaN(value)) {
    return `${fieldName} must be a number`;
  }
  return "";
};

export const validatePositiveNumber = (value, fieldName = "This field") => {
  if (value && (isNaN(value) || Number(value) < 0)) {
    return `${fieldName} must be a positive number`;
  }
  return "";
};

export const validateUrl = (url) => {
  if (!url) return "";
  const urlRegex =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if (!urlRegex.test(url)) {
    return "Please enter a valid URL";
  }
  return "";
};

/**
 * Get user-friendly API error message
 */
export const getErrorMessage = (error) => {
  // Network error
  if (!error.response) {
    return "Network error. Please check your internet connection and try again.";
  }

  const status = error.response.status;
  const data = error.response.data;

  // Custom error message from backend
  if (data?.message) {
    return data.message;
  }

  // Status-based messages
  switch (status) {
    case 400:
      return "Invalid request. Please check your input and try again.";
    case 401:
      return "Please login to continue.";
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return "The requested resource was not found.";
    case 409:
      return "This item already exists. Please try a different value.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    case 500:
      return "Server error. Please try again later.";
    case 503:
      return "Service temporarily unavailable. Please try again later.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};

/**
 * Handle file upload validation
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"],
    allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"],
  } = options;

  if (!file) {
    return "Please select a file";
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return `File size must be less than ${maxSizeMB}MB`;
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    const types = allowedExtensions.join(", ");
    return `File must be one of: ${types}`;
  }

  return "";
};

/**
 * Validate form data object
 */
export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const value = data[field];
    const fieldRules = rules[field];

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
