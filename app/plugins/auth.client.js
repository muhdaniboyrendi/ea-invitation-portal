export default defineNuxtPlugin(async () => {
  const { fetchCurrentUser } = useAuthStore();

  await fetchCurrentUser();
});
