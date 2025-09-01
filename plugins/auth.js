export default defineNuxtPlugin(async (nuxtApp) => {
  const { fetchCurrentUser } = useAuthStore();

  try {
    await fetchCurrentUser();
  } catch (e) {
    console.error("Auth plugin error:", e);
  }

  nuxtApp.hook("page:start", async () => {
    try {
      const shouldRefetch = useState("shouldRefetchUser", () => true);
      if (shouldRefetch.value) {
        shouldRefetch.value = false;
        await fetchCurrentUser();
        setTimeout(() => {
          shouldRefetch.value = true;
        }, 1000);
      }
    } catch (e) {
      console.error("Auth page start error:", e);
    }
  });
});
