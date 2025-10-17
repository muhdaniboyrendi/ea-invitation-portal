export const useGroomStore = defineStore("groom", () => {
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

  const fetchGroom = async (id) => {
    try {
      const response = await $fetch(`${apiBaseUrl}/main-infos/${id}`, {
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

  const createGroom = async (groomData) => {
    const formData = new FormData();

    formData.append("invitation_id", groomData.invitation_id);
    formData.append("full_name", groomData.full_name);
    formData.append("father", groomData.father);
    formData.append("mother", groomData.mother);
    formData.append("instagram", groomData.instagram);

    if (groomData.photo) {
      formData.append("photo", groomData.photo);
    }

    try {
      const response = await $fetch(`/api/grooms/create`, {
        method: "POST",
        body: formData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const updateGroom = async (id, groomData) => {
    const formData = new FormData();

    formData.append("_method", "PUT");
    formData.append("full_name", groomData.full_name);
    formData.append("father", groomData.father);
    formData.append("mother", groomData.mother);
    formData.append("instagram", groomData.instagram);

    if (groomData.photo) {
      formData.append("photo", groomData.photo);
    }

    try {
      const response = await $fetch(`/api/grooms/${id}`, {
        method: "POST",
        body: formData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const deleteGroom = async (id) => {
    try {
      const response = await $fetch(`/api/grooms/${id}`, {
        method: "DELETE",
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  return {
    fetchGroom,
    createGroom,
    updateGroom,
    deleteGroom,
  };
});
