export const useLoveStoryStore = defineStore("loveStory", () => {
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

  const fetchLoveStories = async (invitationId) => {
    try {
      const response = await $fetch(
        `${apiBaseUrlPublic}/love-stories/${invitationId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const createLoveStory = async (storyData) => {
    const formData = new FormData();

    formData.append("invitation_id", storyData.invitation_id);
    formData.append("title", storyData.title);
    formData.append("date", storyData.date);
    formData.append("description", storyData.description);

    if (storyData.thumbnail) {
      formData.append("thumbnail", storyData.thumbnail);
    }

    try {
      const response = await $fetch(`/api/loveStories/create`, {
        method: "POST",
        body: formData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const updateLoveStory = async (id, storyData) => {
    const formData = new FormData();

    formData.append("_method", "PUT");
    formData.append("title", storyData.title);
    formData.append("date", storyData.date);
    formData.append("description", storyData.description);

    if (storyData.thumbnail) {
      formData.append("thumbnail", storyData.thumbnail);
    }

    try {
      const response = await $fetch(`/api/loveStories/${id}`, {
        method: "POST",
        body: formData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const deleteLoveStory = async (id) => {
    try {
      const response = await $fetch(`/api/loveStories/${id}`, {
        method: "DELETE",
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  return {
    fetchLoveStories,
    createLoveStory,
    updateLoveStory,
    deleteLoveStory,
  };
});
