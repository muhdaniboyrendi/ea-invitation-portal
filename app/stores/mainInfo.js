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

  const createMainInfo = async (mainInfoData) => {
    const formData = new FormData();

    formData.append("invitation_id", mainInfoData.invitation_id);
    formData.append("music_id", mainInfoData.music_id);
    formData.append("wedding_date", mainInfoData.wedding_date);
    formData.append("wedding_time", mainInfoData.wedding_time);
    formData.append("time_zone", mainInfoData.time_zone);

    if (mainInfoData.main_photo) {
      formData.append("main_photo", mainInfoData.main_photo);
    }

    if (mainInfoData.custom_backsound) {
      formData.append("custom_backsound", mainInfoData.custom_backsound);
    }

    try {
      const response = await $fetch(`/api/mainInfos/create`, {
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
