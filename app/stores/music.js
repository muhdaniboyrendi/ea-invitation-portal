export const useMusicStore = defineStore("music", () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  const {
    data: musics,
    error: musicsError,
    pending: musicsPending,
    refresh: musicsRefresh,
  } = useFetch(`${apiBaseUrl}/musics`, {
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

  const fetchMusic = async (id) => {
    try {
      const response = await $fetch(`${apiBaseUrl}/musics/${id}`, {
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

  const createMusic = async (musicData) => {
    const formData = new FormData();

    formData.append("name", musicData.name);
    formData.append("artist", musicData.artist);

    if (musicData.audio) {
      formData.append("audio", musicData.audio);
    }

    if (musicData.thumbnail) {
      formData.append("thumbnail", musicData.thumbnail);
    }

    try {
      const response = await $fetch(`/api/musics/create`, {
        method: "POST",
        body: formData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const updateMusic = async (musicId, musicData) => {
    const formData = new FormData();

    formData.append("_method", "PUT");
    formData.append("name", musicData.name);
    formData.append("artist", musicData.artist);

    if (musicData.audio) {
      formData.append("audio", musicData.audio);
    }

    if (musicData.thumbnail) {
      formData.append("thumbnail", musicData.thumbnail);
    }

    try {
      const response = await $fetch(`/api/musics/${musicId}`, {
        method: "POST",
        body: formData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const deleteMusic = async (musicId) => {
    try {
      const response = await $fetch(`/api/musics/${musicId}`, {
        method: "DELETE",
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  return {
    musics,
    musicsError,
    musicsPending,
    musicsRefresh,
    fetchMusic,
    createMusic,
    updateMusic,
    deleteMusic,
  };
});
