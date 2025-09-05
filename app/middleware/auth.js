export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = storeToRefs(useAuthStore());

  if (!isLoggedIn.value) {
    return navigateTo("/login");
  }
});
