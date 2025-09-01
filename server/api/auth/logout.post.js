export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  try {
    const token = getCookie(event, "auth_token");

    if (token) {
      // Call Laravel API to invalidate token
      await $fetch(`${apiBaseUrl}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    }

    // Delete the cookie regardless of API response
    deleteCookie(event, "auth_token", {
      path: "/",
      httpOnly: true,
    });

    return {
      status: true,
      message: "Logged out successfully",
    };
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
