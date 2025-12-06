export const useThemeCategoryStore = defineStore("themeCategory", () => {
  const config = useRuntimeConfig();
  const apiBaseUrlPublic = config.public.apiBaseUrlPublic;

  const {
    data: categories,
    error: categoryError,
    pending: categoriesPending,
    refresh: categoriesRefresh,
  } = useFetch(`${apiBaseUrlPublic}/categories`, {
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

  const createThemeCategory = async (formData) => {
    try {
      const response = await $fetch(`/api/themeCategories/create`, {
        method: "POST",
        body: formData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const updateThemeCategory = async (id, formData) => {
    try {
      const response = await $fetch(`/api/themeCategories/${id}`, {
        method: "PUT",
        body: formData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const deleteThemeCategory = async (id) => {
    try {
      const response = await $fetch(`/api/themeCategories/${id}`, {
        method: "DELETE",
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  return {
    categories,
    categoryError,
    categoriesPending,
    categoriesRefresh,
    createThemeCategory,
    updateThemeCategory,
    deleteThemeCategory,
  };
});
