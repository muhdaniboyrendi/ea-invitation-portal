export const usePackageStore = defineStore("package", () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  const {
    data: themes,
    error,
    pending,
    refresh,
  } = useFetch(`${apiBaseUrl}/themes`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    transform: (response) => {
      return response.data;
    },
  });

  return {
    themes,
    error,
    pending,
    refresh,
  };
});
