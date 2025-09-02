export default defineNuxtRouteMiddleware(async (to, from) => {
  const { fetchUser } = useAuthStore();
  const { user } = storeToRefs(useAuthStore());

  // Skip auth check for login and register pages
  const publicPages = ["/login", "/register"];
  if (publicPages.includes(to.path)) {
    return;
  }

  // If user is not loaded, try to fetch from server
  if (!user) {
    try {
      await fetchUser();
    } catch (error) {
      return navigateTo("/login");
    }
  }

  // If still no user, redirect to login
  if (!user) {
    return navigateTo("/login");
  }
});
