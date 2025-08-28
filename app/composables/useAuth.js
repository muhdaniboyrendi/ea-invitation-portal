export const useAuthStore = defineStore("auth", () => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  const login = async (credentials) => {
    try {
      const response = await $fetch("/api/auth/login", {
        method: "POST",
        body: credentials,
      });

      if (response.status) {
        user.value = response.data.user;
        user.value.role == "admin"
          ? navigateTo("/dashboard")
          : navigateTo("/dashboard/home");
        return true;
      } else {
        error.value = response.message || "Login failed client";
        console.log("login failed", response.message);
        return false;
      }
    } catch (e) {
      error.value = e.message || "Login failed";
      console.log(e);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    login,
  };
});
