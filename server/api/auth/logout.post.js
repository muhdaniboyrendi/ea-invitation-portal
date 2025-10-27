// server/api/auth/logout.post.js
export default defineEventHandler(async (event) => {
  const token = getCookie(event, "auth_token");

  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  try {
    const response = await $fetch(`${apiBaseUrl}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    deleteCookie(event, "auth_token", {
      path: "/",
      httpOnly: true,
    });

    return response;
  } catch (error) {
    // Still delete the cookie if API call fails
    deleteCookie(event, "auth_token", {
      path: "/",
      httpOnly: true,
    });

    throw createError({
      statusCode: error.status || 500,
      message: error.data?.message || "Internal Server Error",
      data: { errors: error.data?.errors || error.data?.error || {} },
    });
  }
});
