// composables/useFormValidation.js
export const useFormValidation = (validationPatterns) => {
  const frontendErrors = ref({});
  const backendErrors = ref({});

  const validationErrors = computed(() => ({
    ...frontendErrors.value,
    ...backendErrors.value,
  }));

  const clearFrontendError = (field) => {
    if (frontendErrors.value[field]) {
      delete frontendErrors.value[field];
    }
  };

  const clearBackendError = (field) => {
    if (backendErrors.value[field]) {
      delete backendErrors.value[field];
    }
  };

  const setBackendValidationErrors = (errors) => {
    if (!errors || typeof errors !== "object") return;

    backendErrors.value = {};

    Object.keys(errors).forEach((field) => {
      if (errors[field]) {
        if (Array.isArray(errors[field])) {
          backendErrors.value[field] = errors[field][0];
        } else {
          backendErrors.value[field] = errors[field];
        }
      }
    });
  };

  const validateWithPattern = (field, value, pattern) => {
    clearFrontendError(field);

    const trimmedValue = typeof value === "string" ? value.trim() : value;

    // Check required
    if (pattern.required && !pattern.required.test(trimmedValue || "")) {
      frontendErrors.value[field] = pattern.message.required;
      return false;
    }

    // Check additional patterns
    for (const [key, regex] of Object.entries(pattern)) {
      if (key === "required" || key === "message") continue;

      if (!regex.test(trimmedValue || "")) {
        frontendErrors.value[field] = pattern.message[key];
        return false;
      }
    }

    return true;
  };

  const resetErrors = () => {
    frontendErrors.value = {};
    backendErrors.value = {};
  };

  return {
    frontendErrors,
    backendErrors,
    validationErrors,
    clearFrontendError,
    clearBackendError,
    setBackendValidationErrors,
    validateWithPattern,
    resetErrors,
  };
};
