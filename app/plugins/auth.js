export default defineNuxtPlugin(async (nuxtApp) => {
  const { fetchUser } = useAuthStore();

  try {
    await fetchUser();
  } catch (error) {
    console.error("User unauthenticated:", error);
  }
});
