export const useGuestStore = defineStore("guest", () => {
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

  const fetchGuests = async (invitationId) => {
    try {
      const response = await $fetch(`/api/guests/${invitationId}`, {
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

  const createGuest = async (guestData) => {
    try {
      const response = await $fetch(`/api/guests/create`, {
        method: "POST",
        body: guestData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const updateGuest = async (id, guestData) => {
    try {
      const response = await $fetch(`/api/guests/${id}`, {
        method: "PUT",
        body: guestData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const deleteGuest = async (id) => {
    try {
      const response = await $fetch(`/api/guests/${id}`, {
        method: "DELETE",
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  return {
    fetchGuests,
    createGuest,
    updateGuest,
    deleteGuest,
  };
});
