export const useGiftStore = defineStore("gift", () => {
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

  const fetchGifts = async (invitationId) => {
    try {
      const response = await $fetch(`${apiBaseUrl}/gifts/${invitationId}`, {
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

  const createGift = async (giftData) => {
    try {
      const response = await $fetch(`/api/gifts/create`, {
        method: "POST",
        body: giftData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const updateGift = async (id, giftData) => {
    try {
      const response = await $fetch(`/api/gifts/${id}`, {
        method: "PUT",
        body: giftData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const deleteGift = async (id) => {
    try {
      const response = await $fetch(`/api/gifts/${id}`, {
        method: "DELETE",
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  return {
    fetchGifts,
    createGift,
    updateGift,
    deleteGift,
  };
});
