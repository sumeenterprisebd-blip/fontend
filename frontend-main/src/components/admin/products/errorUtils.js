/**
 * Formats error messages from API responses
 */
export const formatErrorMessage = (error) => {
  if (!error?.response?.data) {
    return error?.message || "An error occurred. Please try again.";
  }

  const errorData = error.response.data;

  // Prioritize errors array (most specific validation errors)
  if (errorData.errors) {
    if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
      return errorData.errors
        .map((e) => {
          if (typeof e === "string") return `• ${e}`;
          const msg = e.msg || e.message || JSON.stringify(e);
          return `• ${msg}`;
        })
        .join("\n");
    }

    if (
      typeof errorData.errors === "object" &&
      !Array.isArray(errorData.errors)
    ) {
      const errorKeys = Object.keys(errorData.errors);
      if (errorKeys.length > 0) {
        return errorKeys
          .map((key) => {
            const err = errorData.errors[key];
            const fieldName =
              key.charAt(0).toUpperCase() +
              key
                .slice(1)
                .replace(/([A-Z])/g, " $1")
                .trim();
            if (typeof err === "string") {
              return `• ${fieldName}: ${err}`;
            }
            const msg = err.message || err.msg || JSON.stringify(err);
            return `• ${fieldName}: ${msg}`;
          })
          .join("\n");
      }
    }
  }

  // Fallback to message
  if (errorData.message) {
    return errorData.message;
  }

  if (errorData.error) {
    if (typeof errorData.error === "string") {
      return errorData.error;
    }
    if (errorData.error.message) {
      return errorData.error.message;
    }
  }

  return "Error saving product. Please check all fields and try again.";
};
