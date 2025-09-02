export default defineNuxtRouteMiddleware(async (to, from) => {
  const { fetchUser } = useAuthStore();
  const { user } = storeToRefs(useAuthStore());

  // Try to fetch user if not already loaded
  if (!user) {
    try {
      await fetchUser();
    } catch (error) {
      // User is not authenticated, which is expected for guest middleware
      return;
    }
  }

  // If user is authenticated, redirect to /
  if (user) {
    return navigateTo("/");
  }
});
