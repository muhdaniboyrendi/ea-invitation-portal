export const useBrideStore = defineStore("bride", () => {
  const config = useRuntimeConfig();
  const apiBaseUrlPublic = config.public.apiBaseUrlPublic;

  const handleApiError = (error) => {
    const err = new Error(
      error.data?.message || "Terjadi kesalahan pada server"
    );
    err.status = error.status || error.data?.statusCode || 500;
    err.validationErrors = error.data?.data?.errors || error.data?.errors || {};
    return err;
  };

  const fetchBride = async (id) => {
    try {
      const response = await $fetch(`${apiBaseUrlPublic}/brides/${id}`, {
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

  const createBride = async (brideData) => {
    const formData = new FormData();

    formData.append("invitation_id", brideData.invitation_id);
    formData.append("full_name", brideData.full_name);
    formData.append("father", brideData.father);
    formData.append("mother", brideData.mother);
    formData.append("instagram", brideData.instagram);

    if (brideData.photo) {
      formData.append("photo", brideData.photo);
    }

    try {
      const response = await $fetch(`/api/brides/create`, {
        method: "POST",
        body: formData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const updateBride = async (id, brideData) => {
    const formData = new FormData();

    formData.append("_method", "PUT");
    formData.append("full_name", brideData.full_name);
    formData.append("father", brideData.father);
    formData.append("mother", brideData.mother);
    formData.append("instagram", brideData.instagram);

    if (brideData.photo) {
      formData.append("photo", brideData.photo);
    }

    try {
      const response = await $fetch(`/api/brides/${id}`, {
        method: "POST",
        body: formData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const deleteBride = async (id) => {
    try {
      const response = await $fetch(`/api/brides/${id}`, {
        method: "DELETE",
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  return {
    fetchBride,
    createBride,
    updateBride,
    deleteBride,
  };
});
