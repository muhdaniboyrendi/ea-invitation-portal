export const useAuthStore = defineStore("auth", () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  const user = useState("user", () => null);
  const isLoggedIn = computed(() => !!user.value);

  const handleApiError = (error) => {
    const err = new Error(
      error.data?.message || "Terjadi kesalahan pada server"
    );
    err.status = error.status || error.data?.statusCode || 500;
    err.validationErrors = error.data?.data?.errors || error.data?.errors || {};
    return err;
  };

  const register = async (userData) => {
    try {
      const response = await $fetch(`/api/auth/register`, {
        method: "POST",
        body: userData,
      });

      user.value = response.data.user;
      await navigateTo("/");

      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await $fetch(`/api/auth/login`, {
        method: "POST",
        body: credentials,
      });

      user.value = response.data.user;

      await nextTick();
      user.value.role === "admin"
        ? await navigateTo("/dashboard")
        : await navigateTo("/");

      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const logout = async () => {
    try {
      await $fetch(`/api/auth/logout`, {
        method: "POST",
      });

      navigateTo("/login");
    } catch (error) {
      throw handleApiError(error);
    } finally {
      user.value = null;
    }
  };

  const initializeUser = async () => {
    try {
      const { data } = await useFetch(`/api/auth/user`, {
        method: "GET",
      });

      user.value = data.value;
      return data.value;
    } catch (error) {
      user.value = null;
      throw handleApiError(error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await $fetch(`/api/auth/user`, {
        method: "GET",
      });

      user.value = response;
      return response;
    } catch (error) {
      user.value = null;
      throw handleApiError(error);
    }
  };

  const loginWithGoogleRedirect = async () => {
    try {
      const response = await $fetch(`${apiBaseUrl}/auth/google/redirect`, {
        method: "GET",
      });

      window.location.href = response.data.auth_url;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const handleGoogleCallback = async (code, state = null) => {
    try {
      const query = { code };
      if (state) query.state = state;

      const response = await $fetch(`/api/auth/google/callback`, {
        method: "GET",
        query,
      });

      if (response?.data?.user) {
        user.value = response.data.user;
        await nextTick();

        response.data.user?.role === "admin"
          ? await navigateTo("/dashboard")
          : await navigateTo("/");
      } else {
        throw new Error("No user data returned");
      }

      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  };

  return {
    // State
    user,
    isLoggedIn,

    // Regular Auth
    register,
    login,
    logout,
    initializeUser,
    fetchUser,

    // Google OAuth Methods
    loginWithGoogleRedirect,
    handleGoogleCallback,
  };
});
