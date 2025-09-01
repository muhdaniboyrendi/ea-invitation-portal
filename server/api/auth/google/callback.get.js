export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;
  const query = getQuery(event);

  try {
    const response = await $fetch(`${apiBaseUrl}/auth/google/callback`, {
      method: "GET",
      params: query,
    });

    if (response && response.status && response.data.token) {
      setCookie(event, "auth_token", response.data.token, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV !== "development",
        maxAge: 60 * 60 * 24 * 7,
      });

      setCookie(event, "user_data", JSON.stringify(response.data.user), {
        path: "/",
        secure: process.env.NODE_ENV !== "development",
        maxAge: 60 * 60 * 24 * 7,
      });

      return sendRedirect(event, "/");
    }

    return sendRedirect(
      event,
      `/login?error=${encodeURIComponent("Authentication failed")}`
    );
  } catch (error) {
    return sendRedirect(
      event,
      `/login?error=${encodeURIComponent(
        error.message || "Authentication failed"
      )}`
    );
  }
});
