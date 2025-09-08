export const useAuthStore = defineStore("auth", () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  const user = useState("user", () => null);
  const isLoggedIn = computed(() => !!user.value);
  const isLoading = useState("auth-loading", () => false);

  const handleApiError = (error) => {
    const err = new Error(
      error.data?.message || "Terjadi kesalahan pada server"
    );
    err.status = error.status || error.data?.statusCode || 500;
    err.validationErrors = error.data?.data?.errors || error.data?.errors || {};
    return err;
  };

  const register = async (userData) => {
    isLoading.value = true;
    try {
      const response = await $fetch(`/api/auth/register`, {
        method: "POST",
        body: userData,
      });

      if (response) {
        user.value = response.data.user;
        await navigateTo("/");
      }

      return response;
    } catch (error) {
      throw handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (credentials) => {
    isLoading.value = true;

    try {
      const response = await $fetch(`/api/auth/login`, {
        method: "POST",
        body: credentials,
      });

      if (response) {
        user.value = response.data;
        // Gunakan nextTick untuk memastikan state update
        await nextTick();
        user.value.role === "admin"
          ? await navigateTo("/dashboard")
          : await navigateTo("/");
      }

      return response;
    } catch (error) {
      throw handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    isLoading.value = true;

    try {
      await $fetch(`/api/auth/logout`, {
        method: "POST",
      });
    } catch (error) {
      throw handleApiError(error);
    } finally {
      user.value = null;
      isLoading.value = false;
      await navigateTo("/login");
    }
  };

  const fetchUser = async () => {
    if (isLoading.value) return user.value;

    isLoading.value = true;

    try {
      const response = await $fetch(`/api/auth/user`, {
        method: "GET",
      });

      user.value = response;
      return response;
    } catch (error) {
      throw handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      window.location.href = `/api/auth/auth/google`;
      return true;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const handleGoogleCallback = async (code) => {
    try {
      const response = await $fetch(`/api/auth/google/callback`, {
        method: "GET",
        query: { code }, // Gunakan query instead of params
      });

      await fetchUser();
      await nextTick();

      user.value?.role === "admin"
        ? await navigateTo("/dashboard")
        : await navigateTo("/");

      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  return {
    user,
    isLoggedIn,
    isLoading,
    register,
    login,
    logout,
    fetchUser,
    loginWithGoogle,
    handleGoogleCallback,
  };
});
