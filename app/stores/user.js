export const useUserStore = defineStore("user", () => {
  const handleApiError = (error) => {
    const err = new Error(
      error.data?.message || "Terjadi kesalahan pada server"
    );
    err.status = error.status || error.data?.statusCode || 500;
    err.validationErrors = error.data?.data?.errors || error.data?.errors || {};
    return err;
  };

  const updateUser = async (userData) => {
    try {
      const response = await $fetch(`/api/users/profile`, {
        method: "PUT",
        body: userData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const updatePassword = async (formData) => {
    try {
      const response = await $fetch(`/api/users/password`, {
        method: "PUT",
        body: formData,
      });

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const deleteUser = async (packageId) => {
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
    updateUser,
    updatePassword,
    deleteUser,
  };
});
