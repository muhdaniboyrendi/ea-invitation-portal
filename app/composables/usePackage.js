export const usePackageStore = defineStore("package", () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  const {
    data: packages,
    error,
    pending,
    refresh,
  } = useFetch(`${apiBaseUrl}/packages`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    transform: (response) => {
      return response.data;
    },
  });

  const fetchPackage = async (id) => {
    try {
      const response = await $fetch(`${apiBaseUrl}/packages/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching theme:", error);
      throw new Error("Failed to load theme details. Please try again.");
    }
  };

  return {
    packages,
    error,
    pending,
    refresh,
    fetchPackage,
  };
});
