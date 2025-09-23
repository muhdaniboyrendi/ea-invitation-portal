// server/api/auth/google/callback.get.js
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;
  const query = getQuery(event);

  try {
    const response = await $fetch(`${apiBaseUrl}/auth/google/callback`, {
      method: "GET",
      query: query, 
    });

    if (response?.data?.token) {
      setCookie(event, "auth_token", response.data.token, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
    }

    return response;
  } catch (error) {
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.message || "Authentication failed",
      data: { errors: error.data?.errors || error.data?.error || {} },
    });
  }
});