export const useThemeCategoryStore = defineStore("themeCategory", () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  const {
    data: categories,
    error: categoryError,
    pending: categoriesPending,
    refresh: categoriesRefresh,
  } = useFetch(`${apiBaseUrl}/categories`, {
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

  return {
    categories,
    categoryError,
    categoriesPending,
    categoriesRefresh,
  };
});
