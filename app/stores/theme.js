export const useThemeStore = defineStore("theme", () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  const {
    data: themes,
    error: themesError,
    pending: themesPending,
    refresh: themesRefresh,
  } = useFetch(`${apiBaseUrl}/themes`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    transform: (response) => {
      return response.data;
    },
  });

  const handleApiError = (error) => {
    const err = new Error(
      error.data?.message || "Terjadi kesalahan pada server"
    );
    err.status = error.status || error.data?.statusCode || 500;
    err.validationErrors = error.data?.data?.errors || error.data?.errors || {};
    return err;
  };

  const fetchTheme = async (id) => {
    try {
      const response = await $fetch(`${apiBaseUrl}/themes/${id}`, {
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

  const createTheme = async (themeData) => {
    const formData = new FormData();
    formData.append("name", themeData.name);
    formData.append("theme_category_id", themeData.theme_category_id);
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

  const updateTheme = async (themeId, themeData) => {
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", themeData.name);
    formData.append("theme_category_id", themeData.theme_category_id);
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

  const deleteTheme = async (packageId) => {
    try {
      const response = await $fetch(`/api/themes/${packageId}`, {
        method: "DELETE",
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const fetchThemesByOrderId = async (orderId) => {
    try {
      const response = await $fetch(`/api/themes/order/${orderId}`, {
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

  const fetchThemesByInvitationId = async (invitationId) => {
    try {
      const response = await $fetch(`/api/themes/invitation/${invitationId}`, {
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

  return {
    themes,
    themesError,
    themesPending,
    themesRefresh,
    fetchTheme,
    createTheme,
    updateTheme,
    deleteTheme,
    fetchThemesByOrderId,
    fetchThemesByInvitationId,
  };
});
