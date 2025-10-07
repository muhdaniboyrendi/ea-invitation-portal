// composables/useFormNotification.js
export const useFormNotification = () => {
  const notification = reactive({
    showSuccess: false,
    showError: false,
    errorMessage: "",
  });

  const showNotification = (type, message, duration = 5000) => {
    if (type === "success") {
      notification.showSuccess = true;
      notification.showError = false;
      notification.errorMessage = "";

      setTimeout(() => {
        notification.showSuccess = false;
      }, duration);
    } else {
      notification.showError = true;
      notification.showSuccess = false;
      notification.errorMessage = message;

      setTimeout(() => {
        notification.showError = false;
        notification.errorMessage = "";
      }, duration);
    }
  };

  const hideNotifications = () => {
    notification.showSuccess = false;
    notification.showError = false;
    notification.errorMessage = "";
  };

  return {
    notification,
    showNotification,
    hideNotifications,
  };
};
