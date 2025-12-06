export const usePackageStore = defineStore("package", () => {
  const config = useRuntimeConfig();
  const apiBaseUrlPublic = config.public.apiBaseUrlPublic;

  const {
    data: packages,
    error,
    pending,
    refresh,
  } = useFetch(`${apiBaseUrlPublic}/packages`, {
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

  const fetchPackage = async (id) => {
    try {
      const response = await $fetch(`${apiBaseUrlPublic}/packages/${id}`, {
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

  const createPackage = async (packageData) => {
    try {
      const response = await $fetch(`/api/packages/create`, {
        method: "POST",
        body: packageData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const updatePackage = async (packageId, packageData) => {
    try {
      const response = await $fetch(`/api/packages/${packageId}`, {
        method: "PUT",
        body: packageData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const deletePackage = async (packageId) => {
    try {
      const response = await $fetch(`/api/packages/${packageId}`, {
        method: "DELETE",
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  return {
    packages,
    error,
    pending,
    refresh,
    fetchPackage,
    createPackage,
    updatePackage,
    deletePackage,
  };
});
