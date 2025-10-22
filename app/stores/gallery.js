export const useGalleryStore = defineStore("gallery", () => {
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

  const fetchGalleries = async (invitationId) => {
    try {
      const response = await $fetch(`${apiBaseUrl}/galleries/${invitationId}`, {
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

  // useGalleryStore
  const createGalleries = async (formData) => {
    try {
      const response = await $fetch(`/api/galleries/create`, {
        method: "POST",
        body: formData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const deleteGallery = async (id) => {
    try {
      const response = await $fetch(`/api/galleries/${id}`, {
        method: "DELETE",
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  return {
    fetchGalleries,
    createGalleries,
    deleteGallery,
  };
});
