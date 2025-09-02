export default defineNuxtPlugin(async () => {
  const { fetchUser } = useAuthStore();

  // Try to restore user session on client-side hydration
  try {
    await fetchUser();
  } catch (error) {
    // User is not authenticated, which is fine
    console.log("No active session found");
  }
});
