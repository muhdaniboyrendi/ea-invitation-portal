export const useMainInfoStore = defineStore("mainInfo", () => {
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

  const fetchMainInfo = async (id) => {
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

  const createMainInfo = async (themeData) => {
    const formData = new FormData();
    formData.append("name", themeData.name);
    formData.append("theme_category_id", themeData.theme_category_id);
    formData.append("link", themeData.link);
    formData.append("is_premium", themeData.is_premium ? "1" : "0");

    if (themeData.thumbnail) {
      formData.append("thumbnail", themeData.thumbnail);
    }

    try {
      const response = await $fetch(`/api/themes/create`, {
        method: "POST",
        body: formData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const updateMainInfo = async (themeId, themeData) => {
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", themeData.name);
    formData.append("theme_category_id", themeData.theme_category_id);
    formData.append("link", themeData.link);
    formData.append("is_premium", themeData.is_premium ? "1" : "0");

    if (themeData.thumbnail) {
      formData.append("thumbnail", themeData.thumbnail);
    }

    try {
      const response = await $fetch(`/api/themes/${themeId}`, {
        method: "POST",
        body: formData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const deleteMainInfo = async (packageId) => {
    try {
      const response = await $fetch(`/api/themes/${packageId}`, {
        method: "DELETE",
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  return {
    fetchMainInfo,
    createMainInfo,
    updateMainInfo,
    deleteMainInfo,
  };
});
