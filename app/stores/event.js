export const useEventStore = defineStore("event", () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  const handleApiError = (error) => {
    const err = new Error(
      error.data?.message || "Terjadi kesalahan pada server"
    );
    err.status = error.status || error.data?.statusCode || 500;
    err.validationErrors = error.data?.data?.errors || error.data?.errors || {};
    return err;
  };

  const fetchEvents = async (invitationId) => {
    try {
      const response = await $fetch(`${apiBaseUrl}/events/${invitationId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const createEvent = async (eventData) => {
    try {
      const response = await $fetch(`/api/events/create`, {
        method: "POST",
        body: eventData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const updateEvent = async (id, eventData) => {
    try {
      const response = await $fetch(`/api/events/${id}`, {
        method: "PUT",
        body: eventData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      const response = await $fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  return {
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
});
