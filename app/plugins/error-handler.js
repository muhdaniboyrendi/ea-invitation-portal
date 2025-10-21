// app/plugins/error-handler.js
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("vue:error", (error) => {
    if (error.status === 401 || error.status === 404) {
      const authStore = useAuthStore();
      authStore.user = null;
      navigateTo("/login");
    }
  });
});
