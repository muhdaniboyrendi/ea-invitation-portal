// app/plugins/auth.js
export default defineNuxtPlugin(async (nuxtApp) => {
  const { initializeUser } = useAuthStore();
  const { isLoggedIn } = storeToRefs(useAuthStore());

  if (!isLoggedIn.value) {
    try {
      await initializeUser();
    } catch (error) {
      // Jika error 401 atau 404, pastikan user state kosong
      // Cookie sudah dihapus di server-side
      if (error.status === 401 || error.status === 404) {
        const authStore = useAuthStore();
        authStore.user = null;
      }
    }
  }
});
