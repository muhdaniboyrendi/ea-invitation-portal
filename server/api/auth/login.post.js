export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;
  const body = await readBody(event);

  try {
    const response = await $fetch(`${apiBaseUrl}/login`, {
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response) {
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
      message: error.data?.message || "Internal Server Error",
      data: { errors: error.data?.errors || error.data?.error || {} },
    });
  }
});
