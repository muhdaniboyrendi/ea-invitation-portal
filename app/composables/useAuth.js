export const useAuthStore = defineStore("auth", () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  const user = useState("user", () => null);
  const isLoggedIn = computed(() => !!user.value);
  const token = useState("token", () => null);

  // const register = async (userData) => {
  //   try {
  //     const response = await $fetch("/api/auth/register", {
  //       method: "POST",
  //       body: userData,
  //     });

  //     user.value = response.value.data.user;
  //     user.value.role == "admin"
  //       ? navigateTo("/dashboard")
  //       : navigateTo("/dashboard/home");

  //     return response;
  //   } catch (error) {
  //     const err = new Error(
  //       error.data?.message || "Terjadi kesalahan pada server"
  //     );
  //     err.status = error.data?.statusCode;
  //     err.validationErrors = error.data?.data.errors || {};

  //     throw err;
  //   }
  // };

  const register = async (userData) => {
    try {
      const response = await $fetch(`${apiBaseUrl}/register`, {
        method: "POST",
        body: userData,
        credentials: "include",
      });

      if (response) {
        user.value = response.data.user;
        await navigateTo("/");
      }

      return response;
    } catch (error) {
      const err = new Error(
        error.data?.message || "Terjadi kesalahan pada server"
      );
      err.status = error.data?.statusCode;
      err.validationErrors = error.data?.data.errors || {};

      throw err;
    }
  };

  // const login = async (credentials) => {
  //   try {
  //     const response = await $fetch("/api/auth/login", {
  //       method: "POST",
  //       body: credentials,
  //     });

  //     user.value = response.data.user;
  //     user.value.role == "admin" ? navigateTo("/dashboard") : navigateTo("/");

  //     return response;
  //   } catch (error) {
  //     const err = new Error(
  //       error.data?.message || "Terjadi kesalahan pada server"
  //     );
  //     err.status = error.data?.statusCode;
  //     err.validationErrors = error.data?.data.errors || {};

  //     throw err;
  //   }
  // };

  const login = async (credentials) => {
    try {
      const response = await $fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        body: credentials,
        credentials: "include",
      });

      if (response) {
        user.value = response.data.user;
        user.value.role == "admin" ? navigateTo("/dashboard") : navigateTo("/");
      }

      return response;
    } catch (error) {
      const err = new Error(
        error.data?.message || "Terjadi kesalahan pada server"
      );
      err.status = error.data?.statusCode;
      err.validationErrors = error.data?.data.errors || {};

      throw err;
    }
  };

  // const logout = async () => {
  //   try {
  //     const response = await $fetch("/api/auth/logout", {
  //       method: "POST",
  //     });

  //     user.value = null;

  //     navigateTo("/login");
  //     return response;
  //   } catch (error) {
  //     const err = new Error(
  //       error.data?.message || "Terjadi kesalahan pada server"
  //     );
  //     err.status = error.data?.statusCode;
  //     err.validationErrors = error.data?.data.errors || {};

  //     throw err;
  //   }
  // };

  const logout = async () => {
    try {
      const response = await $fetch(`${apiBaseUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });

      user.value = null;

      await navigateTo("/login");
      return response;
    } catch (error) {
      const err = new Error(
        error.data?.message || "Terjadi kesalahan pada server"
      );
      err.status = error.data?.statusCode;
      err.validationErrors = error.data?.data.errors || {};

      throw err;
    }
  };

  // const fetchCurrentUser = async () => {
  //   try {
  //     const response = await $fetch("/api/auth/user", {
  //       method: "GET",
  //       headers: {
  //         "Cache-Control": "no-cache",
  //       },
  //     });

  //     user.value = response;

  //     return response;
  //   } catch (error) {
  //     const err = new Error(
  //       error.data?.message || "Terjadi kesalahan pada server"
  //     );
  //     err.status = error.data?.statusCode;
  //     err.validationErrors = error.data?.data.errors || {};

  //     throw err;
  //   }
  // };

  const fetchUser = async () => {
    try {
      const response = await $fetch(`${apiBaseUrl}/user`, {
        method: "GET",
        credentials: "include",
      });

      user.value = response;

      return response;
    } catch (error) {
      const err = new Error(
        error.data?.message || "Terjadi kesalahan pada server"
      );
      err.status = error.data?.statusCode;
      err.validationErrors = error.data?.data.errors || {};

      throw err;
    }
  };

  const refreshToken = async () => {
    try {
      const response = await $fetch(`${apiBaseUrl}/refresh`, {
        method: "POST",
        credentials: "include",
      });

      user.value = response.data.user;

      return response;
    } catch (error) {
      console.error("Refresh token error:", error);

      const err = new Error(
        error.data?.message || "Terjadi kesalahan pada server"
      );
      err.status = error.data?.statusCode;
      err.validationErrors = error.data?.data.errors || {};

      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      window.location.href = `${apiBaseUrl}/auth/google`;
      return true;
    } catch (error) {
      const err = new Error(
        error.data?.message || "Terjadi kesalahan pada server"
      );
      err.status = error.data?.statusCode;
      err.validationErrors = error.data?.data.errors || {};

      throw err;
    }
  };

  const handleGoogleCallback = async (code) => {
    try {
      const response = await $fetch(`/api/auth/google/callback`, {
        method: "GET",
        params: { code },
      });

      await fetchUser();

      user.value?.role == "admin" ? navigateTo("/dashboard") : navigateTo("/");

      return response;
    } catch (error) {
      console.error("Google callback error:", error);
      const err = new Error(
        error.data?.message || "Terjadi kesalahan pada server"
      );
      err.status = error.data?.statusCode;
      err.validationErrors = error.data?.data.errors || {};

      throw err;
    }
  };

  return {
    user: readonly(user),
    isLoggedIn,
    token,
    register,
    login,
    logout,
    fetchUser,
    loginWithGoogle,
    handleGoogleCallback,
    refreshToken,
  };
});
