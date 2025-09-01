export const useAuthStore = defineStore("auth", () => {
  const user = useState("user", () => null);
  const isAuthenticated = computed(() => !!user.value);
  const token = useState("token", () => null);

  const register = async (userData) => {
    try {
      const response = await $fetch("/api/auth/register", {
        method: "POST",
        body: userData,
      });

      console.log(response.value);

      user.value = response.value.data.user;
      user.value.role == "admin"
        ? navigateTo("/dashboard")
        : navigateTo("/dashboard/home");

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

  const login = async (credentials) => {
    try {
      const response = await $fetch("/api/auth/login", {
        method: "POST",
        body: credentials,
      });

      user.value = response.data.user;
      user.value.role == "admin" ? navigateTo("/dashboard") : navigateTo("/");

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

  const logout = async () => {
    try {
      const response = await $fetch("/api/auth/logout", {
        method: "POST",
      });

      user.value = null;

      navigateTo("/login");
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

  const fetchCurrentUser = async () => {
    try {
      const response = await $fetch("/api/auth/user", {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      user.value = response.value.data;

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

  const loginWithGoogle = async () => {
    try {
      window.location.href = "/api/auth/google";
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

      await fetchCurrentUser();

      user.value.role == "admin" ? navigateTo("/dashboard") : navigateTo("/");

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

  return {
    user,
    isAuthenticated,
    token,
    register,
    login,
    logout,
    fetchCurrentUser,
    loginWithGoogle,
    handleGoogleCallback,
  };
});
