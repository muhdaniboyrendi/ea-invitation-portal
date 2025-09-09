// plugins/auth.js
export default defineNuxtPlugin(async (nuxtApp) => {
  const { initializeUser } = useAuthStore();
  const { isLoggedIn } = storeToRefs(useAuthStore());

  if (!isLoggedIn.value) {
    try {
      await initializeUser();
    } catch (error) {
      //
    }
  }
});
